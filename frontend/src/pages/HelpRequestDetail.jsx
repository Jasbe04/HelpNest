import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import api from '../api/axios'
import { useAuth } from '../context/AuthContext'


function getUserId(value) {
  if (value === null || value === undefined) {
    return null
  }

  // Supports either a numeric author ID or a nested user object.
  if (typeof value === 'object') {
    return value.id ?? null
  }

  return value
}


function getAuthorName(answer) {
  if (answer.author_username) {
    return answer.author_username
  }

  if (typeof answer.author === 'object' && answer.author !== null) {
    return (
      answer.author.username ||
      answer.author.email ||
      'User'
    )
  }

  return 'User'
}


function formatDate(dateValue) {
  if (!dateValue) {
    return ''
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleString()
}


function getErrorMessage(error, fallback) {
  const data = error.response?.data

  if (typeof data === 'string') {
    return data
  }

  if (data?.detail) {
    return data.detail
  }

  if (data?.content) {
    return Array.isArray(data.content)
      ? data.content.join(' ')
      : data.content
  }

  if (data && typeof data === 'object') {
    return Object.entries(data)
      .map(([field, messages]) => {
        const text = Array.isArray(messages)
          ? messages.join(' ')
          : String(messages)

        return `${field}: ${text}`
      })
      .join(' ')
  }

  return fallback
}


function HelpRequestDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [helpRequest, setHelpRequest] = useState(null)
  const [answers, setAnswers] = useState([])

  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  const [answerContent, setAnswerContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [editingAnswerId, setEditingAnswerId] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  const [actionLoading, setActionLoading] = useState(null)
  const [deletingRequest, setDeletingRequest] = useState(false)


  const currentUserId = getUserId(user?.id)

  const requestAuthorId = getUserId(helpRequest?.author)

  const isRequestAuthor =
    currentUserId !== null &&
    requestAuthorId !== null &&
    String(currentUserId) === String(requestAuthorId)


  const fetchData = useCallback(async () => {
    setLoading(true)
    setPageError('')

    try {
      const [requestResponse, answersResponse] = await Promise.all([
        api.get(`help-requests/${id}/`),
        api.get(`help-requests/${id}/answers/`),
      ])

      setHelpRequest(requestResponse.data)

      const answerData = answersResponse.data

      if (Array.isArray(answerData)) {
        setAnswers(answerData)
      } else if (Array.isArray(answerData.results)) {
        setAnswers(answerData.results)
      } else {
        setAnswers([])
      }
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to load this help request. Please try again.'
        )
      )
    } finally {
      setLoading(false)
    }
  }, [id])


  useEffect(() => {
    fetchData()
  }, [fetchData])


  // Handle deleting the entire help request post
  async function handleDeleteHelpRequest() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this help request? This action cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    setDeletingRequest(true)
    setPageError('')

    try {
      await api.delete(`help-requests/${id}/`)
      navigate('/help-requests', { replace: true })
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to delete this help request. Please try again.'
        )
      )
      setDeletingRequest(false)
    }
  }


  async function handleSubmitAnswer(event) {
    event.preventDefault()

    setFormError('')
    setSuccessMessage('')

    if (!user) {
      setFormError('Please log in before submitting an answer.')
      return
    }

    if (!answerContent.trim()) {
      setFormError('Please write your answer first.')
      return
    }

    setSubmitting(true)

    try {
      await api.post(
        `help-requests/${id}/answers/`,
        {
          content: answerContent.trim(),
        }
      )

      setAnswerContent('')
      setSuccessMessage('Your answer was submitted successfully.')

      await fetchData()
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          'Unable to submit your answer. Please try again.'
        )
      )
    } finally {
      setSubmitting(false)
    }
  }


  function startEditing(answer) {
    setEditingAnswerId(answer.id)
    setEditingContent(answer.content)
    setFormError('')
    setSuccessMessage('')
  }


  function cancelEditing() {
    setEditingAnswerId(null)
    setEditingContent('')
  }


  async function handleUpdateAnswer(answerId) {
    setFormError('')
    setSuccessMessage('')

    if (!editingContent.trim()) {
      setFormError('Answer cannot be empty.')
      return
    }

    setActionLoading(answerId)

    try {
      await api.patch(
        `answers/${answerId}/`,
        {
          content: editingContent.trim(),
        }
      )

      setEditingAnswerId(null)
      setEditingContent('')
      setSuccessMessage('Answer updated successfully.')

      await fetchData()
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          'Unable to update this answer.'
        )
      )
    } finally {
      setActionLoading(null)
    }
  }


  async function handleDeleteAnswer(answer) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this answer? This action cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    setFormError('')
    setSuccessMessage('')
    setActionLoading(answer.id)

    try {
      await api.delete(`answers/${answer.id}/`)

      if (editingAnswerId === answer.id) {
        cancelEditing()
      }

      setSuccessMessage('Answer deleted successfully.')

      await fetchData()
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          'Unable to delete this answer.'
        )
      )
    } finally {
      setActionLoading(null)
    }
  }


  async function handleAcceptAnswer(answer) {
    setFormError('')
    setSuccessMessage('')

    setActionLoading(answer.id)

    try {
      const response = await api.post(
        `answers/${answer.id}/accept/`
      )

      setSuccessMessage(
        response.data.message ||
        'Answer status updated successfully.'
      )

      await fetchData()
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          'Unable to change the accepted status.'
        )
      )
    } finally {
      setActionLoading(null)
    }
  }


  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3">Loading help request...</p>
      </div>
    )
  }


  if (pageError && !helpRequest) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {pageError}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={fetchData}
        >
          Try Again
        </button>

        <Link
          to="/help-requests"
          className="btn btn-outline-secondary ms-2"
        >
          Back to Help Requests
        </Link>
      </div>
    )
  }


  if (!helpRequest) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Help request not found.
        </div>

        <Link to="/help-requests">
          Back to Help Requests
        </Link>
      </div>
    )
  }


  const requestAuthorName =
    helpRequest.author_username ||
    (
      typeof helpRequest.author === 'object'
        ? helpRequest.author?.username
        : null
    ) ||
    'User'


  return (
    <div className="container py-4 py-md-5">

      {/* Back navigation & Author Controls */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <Link
          to="/help-requests"
          className="text-decoration-none"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Help Requests
        </Link>

        {/* Delete button available only to the post creator */}
        {isRequestAuthor && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleDeleteHelpRequest}
            disabled={deletingRequest}
          >
            {deletingRequest ? (
              <>
                <span className="spinner-border spinner-border-sm me-1"></span>
                Deleting Post...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-1"></i>
                Delete Post
              </>
            )}
          </button>
        )}
      </div>


      {/* Error and success messages */}
      {pageError && (
        <div className="alert alert-danger" role="alert">
          {pageError}
        </div>
      )}

      {formError && (
        <div className="alert alert-danger" role="alert">
          {formError}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}


      {/* Help request details */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">

            <span className="badge bg-primary-subtle text-primary">
              {typeof helpRequest.category === 'object'
                ? helpRequest.category?.name
                : helpRequest.category_name || 'Help Request'}
            </span>

            <span
              className={`badge ${
                helpRequest.is_solved
                  ? 'bg-success'
                  : 'bg-warning text-dark'
              }`}
            >
              {helpRequest.is_solved ? 'Solved' : 'Open'}
            </span>

          </div>


          <h1 className="h2 fw-bold mb-3">
            {helpRequest.title}
          </h1>


          <div className="text-muted small mb-4">
            <i className="bi bi-person-circle me-2"></i>

            Posted by <strong>{requestAuthorName}</strong>

            {helpRequest.created_at && (
              <>
                <span className="mx-2">·</span>

                {formatDate(helpRequest.created_at)}
              </>
            )}
          </div>


          <div
            className="mb-0"
            style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
          >
            {helpRequest.description}
          </div>

        </div>
      </div>


      {/* Answer submission form */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body p-4">

          <h2 className="h4 fw-bold mb-3">
            Write an Answer
          </h2>


          {user ? (
            <form onSubmit={handleSubmitAnswer}>

              <div className="mb-3">
                <label
                  htmlFor="answerContent"
                  className="form-label"
                >
                  Your answer
                </label>

                <textarea
                  id="answerContent"
                  className="form-control"
                  rows="5"
                  placeholder="Share your knowledge, experience, or solution..."
                  value={answerContent}
                  onChange={(event) =>
                    setAnswerContent(event.target.value)
                  }
                  disabled={submitting}
                  required
                ></textarea>
              </div>


              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Submit Answer
                  </>
                )}
              </button>

            </form>
          ) : (
            <div className="alert alert-info mb-0">
              Please{' '}
              <Link to="/login">log in</Link>
              {' '}to submit an answer.
            </div>
          )}

        </div>
      </div>


      {/* Answers section */}
      <section>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">

          <h2 className="h3 fw-bold mb-0">
            Answers
          </h2>

          <span className="badge bg-secondary">
            {answers.length}{' '}
            {answers.length === 1 ? 'Answer' : 'Answers'}
          </span>

        </div>


        {answers.length === 0 ? (
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-5">

              <i className="bi bi-chat-square-text display-5 text-muted"></i>

              <h3 className="h5 mt-3">
                No answers yet
              </h3>

              <p className="text-muted mb-0">
                Be the first person to share a helpful answer.
              </p>

            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">

            {answers.map((answer) => {
              const answerAuthorId = getUserId(answer.author)

              const isAnswerAuthor =
                currentUserId !== null &&
                answerAuthorId !== null &&
                String(currentUserId) === String(answerAuthorId)

              const isEditing =
                editingAnswerId === answer.id

              const isActionLoading =
                actionLoading === answer.id


              return (
                <article
                  key={answer.id}
                  className={`card shadow-sm ${
                    answer.is_accepted
                      ? 'border-success'
                      : 'border-0'
                  }`}
                >

                  <div className="card-body p-4">

                    {/* Answer header */}
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">

                      <div>
                        <div className="fw-semibold">
                          <i className="bi bi-person-circle me-2"></i>
                          {getAuthorName(answer)}
                        </div>

                        <small className="text-muted">
                          {formatDate(answer.created_at)}
                        </small>
                      </div>


                      {answer.is_accepted && (
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Accepted Answer
                        </span>
                      )}

                    </div>


                    {/* Answer content or edit form */}
                    {isEditing ? (
                      <div className="mb-3">

                        <label
                          htmlFor={`edit-answer-${answer.id}`}
                          className="form-label"
                        >
                          Edit your answer
                        </label>

                        <textarea
                          id={`edit-answer-${answer.id}`}
                          className="form-control"
                          rows="5"
                          value={editingContent}
                          onChange={(event) =>
                            setEditingContent(event.target.value)
                          }
                          disabled={isActionLoading}
                        ></textarea>

                        <div className="d-flex gap-2 mt-3">

                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={isActionLoading}
                            onClick={() =>
                              handleUpdateAnswer(answer.id)
                            }
                          >
                            {isActionLoading
                              ? 'Saving...'
                              : 'Save Changes'}
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            disabled={isActionLoading}
                            onClick={cancelEditing}
                          >
                            Cancel
                          </button>

                        </div>

                      </div>
                    ) : (
                      <div
                        className="mb-3"
                        style={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.8,
                        }}
                      >
                        {answer.content}
                      </div>
                    )}


                    {/* Answer action buttons */}
                    {!isEditing && (
                      <div className="d-flex flex-wrap gap-2 pt-3 border-top">

                        {/* Edit and delete: answer author only */}
                        {isAnswerAuthor && (
                          <>
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              disabled={isActionLoading}
                              onClick={() => startEditing(answer)}
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              disabled={isActionLoading}
                              onClick={() =>
                                handleDeleteAnswer(answer)
                              }
                            >
                              {isActionLoading ? (
                                'Please wait...'
                              ) : (
                                <>
                                  <i className="bi bi-trash me-1"></i>
                                  Delete
                                </>
                              )}
                            </button>
                          </>
                        )}


                        {/* Accept/unaccept: help-request author only */}
                        {isRequestAuthor && (
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              answer.is_accepted
                                ? 'btn-outline-secondary'
                                : 'btn-success'
                            }`}
                            disabled={isActionLoading}
                            onClick={() =>
                              handleAcceptAnswer(answer)
                            }
                          >
                            {isActionLoading ? (
                              'Please wait...'
                            ) : answer.is_accepted ? (
                              <>
                                <i className="bi bi-check-circle me-1"></i>
                                Accepted — Undo
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-1"></i>
                                Accept Answer
                              </>
                            )}
                          </button>
                        )}

                      </div>
                    )}

                  </div>
                </article>
              )
            })}

          </div>
        )}

      </section>


      {/* Back link */}
      <div className="mt-5">
        <Link
          to="/help-requests"
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left me-2"></i>
          All Help Requests
        </Link>
      </div>

    </div>
  )
}

export default HelpRequestDetail