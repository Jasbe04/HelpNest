import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function CreateHelpRequest() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  })

  const [loadingCategories, setLoadingCategories] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchCategories() {
      try {
        const response = await api.get('categories/')

        if (cancelled) return

        const data = response.data

        setCategories(
          Array.isArray(data) ? data : data.results || [],
        )
      } catch (err) {
        if (!cancelled) {
          console.error(
            'Category loading error:',
            err.response?.data || err,
          )

          setError('Unable to load categories. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false)
        }
      }
    }

    fetchCategories()

    return () => {
      cancelled = true
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSubmitting(true)

    try {
      const response = await api.post(
        'help-requests/',
        {
          title: formData.title.trim(),
          category: Number(formData.category),
          description: formData.description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      // Safely extract the ID regardless of how the backend structures the response
      const newRequestId =
        response.data?.id ||
        response.data?.help_request?.id ||
        response.data?.data?.id

      if (newRequestId) {
        navigate(`/help-requests/${newRequestId}`)
      } else {
        navigate('/help-requests')
      }
    } catch (err) {
      console.error(
        'Help request creation error:',
        err.response?.data || err,
      )

      const data = err.response?.data

      if (data && typeof data === 'object') {
        const messages = Object.entries(data).map(
          ([field, value]) => {
            const details = Array.isArray(value)
              ? value.join(' ')
              : typeof value === 'string'
                ? value
                : JSON.stringify(value)

            return `${field}: ${details}`
          },
        )

        setError(messages.join(' | '))
      } else {
        setError('Unable to create your help request.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link
            to="/help-requests"
            className="text-decoration-none"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Help Requests
          </Link>

          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body p-4 p-md-5">
              <h2 className="fw-bold mb-2">
                Create a Help Request
              </h2>

              <p className="text-secondary mb-4">
                Describe your problem clearly so the community can help you.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="form-label fw-semibold"
                  >
                    Request Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="e.g. How can I prepare for my first internship?"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={255}
                    required
                  />

                  <div className="form-text">
                    Write a short, descriptive title.
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="form-label fw-semibold"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={loadingCategories}
                  >
                    <option value="">
                      {loadingCategories
                        ? 'Loading categories...'
                        : 'Select a category'}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {!loadingCategories &&
                    categories.length === 0 && (
                      <div className="form-text text-danger">
                        No categories are available. Add categories
                        through Django Admin first.
                      </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="form-label fw-semibold"
                  >
                    Describe Your Problem
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows={7}
                    placeholder="Explain your situation, what you have tried, and what kind of help you need..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Actions */}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      submitting ||
                      loadingCategories ||
                      categories.length === 0
                    }
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Publish Request
                      </>
                    )}
                  </button>

                  <Link
                    to="/help-requests"
                    className="btn btn-outline-secondary"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateHelpRequest