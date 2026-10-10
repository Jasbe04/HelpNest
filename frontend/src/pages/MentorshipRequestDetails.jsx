import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  getMentorshipRequest,
  decideMentorshipRequest,
} from '../services/mentorshipApi'

function MentorshipRequestDetails() {
  const { requestId } = useParams()

  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadRequest = async () => {
    try {
      setError('')

      const response = await getMentorshipRequest(requestId)

      setRequest(response.data)
    } catch (err) {
      console.error('Failed to load mentorship request:', err)

      setError(
        err.response?.data?.detail ||
          'Unable to load mentorship request details.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequest()
  }, [requestId])

  const handleDecision = async (decision) => {
    const action = decision === 'accepted' ? 'accept' : 'reject'

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this mentorship request?`
    )

    if (!confirmed) {
      return
    }

    try {
      setProcessing(true)
      setError('')
      setSuccess('')

      await decideMentorshipRequest(requestId, decision)

      await loadRequest()

      setSuccess(
        decision === 'accepted'
          ? 'Mentorship request accepted successfully.'
          : 'Mentorship request rejected successfully.'
      )
    } catch (err) {
      console.error('Failed to update mentorship request:', err)

      setError(
        err.response?.data?.detail ||
          'Unable to process this request. Please try again.'
      )
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3">Loading mentorship request...</p>
      </div>
    )
  }

  if (error && !request) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>

        <Link
          to="/received-mentorships"
          className="btn btn-outline-secondary"
        >
          Back to Received Requests
        </Link>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Mentorship request not found.
        </div>
      </div>
    )
  }

  const status = request.status?.toLowerCase()

  const statusClasses = {
    pending: 'bg-warning text-dark',
    accepted: 'bg-success',
    rejected: 'bg-danger',
    cancelled: 'bg-secondary',
    completed: 'bg-primary',
  }

  const statusClass = statusClasses[status] || 'bg-secondary'

  const topic =
    request.topic_display ||
    request.topic?.replaceAll('_', ' ') ||
    'Not specified'

  const communication =
    request.preferred_communication_display ||
    request.preferred_communication ||
    'Not specified'

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <Link
            to="/received-mentorships"
            className="btn btn-outline-secondary mb-4"
          >
            ← Back to Received Requests
          </Link>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white p-4">
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                  <h2 className="h4 mb-2">
                    {request.title}
                  </h2>

                  <p className="text-muted mb-0">
                    Mentorship Request Details
                  </p>
                </div>

                <span
                  className={`badge ${statusClass} text-capitalize fs-6`}
                >
                  {status}
                </span>
              </div>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              {/* Student Information */}
              <section className="mb-4">
                <h5 className="mb-3">Student Information</h5>

                <div className="bg-light rounded p-3">
                  <p className="mb-2">
                    <strong>Name:</strong>{' '}
                    {request.student_name || 'Not available'}
                  </p>

                  {request.student_email && (
                    <p className="mb-0">
                      <strong>Email:</strong>{' '}
                      {request.student_email}
                    </p>
                  )}
                </div>
              </section>

              {/* Mentorship Information */}
              <section className="mb-4">
                <h5 className="mb-3">Mentorship Information</h5>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted d-block mb-1">
                        Topic
                      </small>

                      <span className="text-capitalize">
                        {topic}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted d-block mb-1">
                        Preferred Communication
                      </small>

                      <span className="text-capitalize">
                        {communication}
                      </span>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <small className="text-muted d-block mb-2">
                        Request Message
                      </small>

                      <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {request.message || 'No message provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <small className="text-muted d-block mb-2">
                        Specific Questions
                      </small>

                      <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {request.specific_questions ||
                          'No specific questions provided.'}
                      </p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <small className="text-muted d-block mb-2">
                        Preferred Availability
                      </small>

                      <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {request.preferred_availability ||
                          'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Request Dates */}
              <section className="mb-4">
                <h5 className="mb-3">Request History</h5>

                <p className="text-muted mb-1">
                  <strong>Submitted:</strong>{' '}
                  {request.created_at
                    ? new Date(request.created_at).toLocaleString()
                    : 'Not available'}
                </p>

                {request.updated_at && (
                  <p className="text-muted mb-0">
                    <strong>Last Updated:</strong>{' '}
                    {new Date(request.updated_at).toLocaleString()}
                  </p>
                )}
              </section>

              {/* Mentor Actions */}
              {status === 'pending' && (
                <section className="border-top pt-4">
                  <h5 className="mb-2">Take Action</h5>

                  <p className="text-muted">
                    Review the student's request before making a decision.
                  </p>

                  <div className="d-flex gap-3 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={processing}
                      onClick={() => handleDecision('accepted')}
                    >
                      {processing
                        ? 'Processing...'
                        : '✓ Accept Request'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={processing}
                      onClick={() => handleDecision('rejected')}
                    >
                      {processing
                        ? 'Processing...'
                        : '✕ Reject Request'}
                    </button>
                  </div>
                </section>
              )}

              {/* Accepted Request */}
              {status === 'accepted' && (
                <section className="alert alert-success mt-4 mb-0">
                  <h5>Mentorship Request Accepted</h5>

                  <p className="mb-0">
                    This mentorship request has been accepted. Review
                    the communication preferences above and coordinate
                    the next steps with the student.
                  </p>
                </section>
              )}

              {/* Rejected Request */}
              {status === 'rejected' && (
                <section className="alert alert-danger mt-4 mb-0">
                  <h5>Mentorship Request Rejected</h5>

                  <p className="mb-0">
                    This request has been rejected. The student can
                    review the updated status on their mentorship page.
                  </p>
                </section>
              )}

              {status === 'completed' && (
                <section className="alert alert-primary mt-4 mb-0">
                  This mentorship request has been marked as completed.
                </section>
              )}

              {status === 'cancelled' && (
                <section className="alert alert-secondary mt-4 mb-0">
                  This mentorship request has been cancelled.
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorshipRequestDetails