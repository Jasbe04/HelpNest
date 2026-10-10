import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../api/axios'

function HelpRequests() {
  const [requests, setRequests] = useState([])
  const [categories, setCategories] = useState([])

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        setLoading(true)
        setError('')

        const [requestsResponse, categoriesResponse] =
          await Promise.all([
            api.get('help-requests/'),
            api.get('categories/'),
          ])

        if (cancelled) return

        // Supports both ordinary arrays and paginated DRF responses.
        const requestData = requestsResponse.data
        const categoryData = categoriesResponse.data

        setRequests(
          Array.isArray(requestData)
            ? requestData
            : requestData.results || [],
        )

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.results || [],
        )
      } catch (err) {
        if (!cancelled) {
          console.error(
            'Unable to load help requests:',
            err.response?.data || err,
          )

          setError(
            'Unable to load help requests. Please check that the Django backend is running.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  // Filter requests by keyword and category.
  const filteredRequests = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return requests.filter((request) => {
      const matchesSearch =
        !keyword ||
        request.title?.toLowerCase().includes(keyword) ||
        request.description?.toLowerCase().includes(keyword) ||
        request.author?.username?.toLowerCase().includes(keyword)

      const categoryId =
        typeof request.category === 'object'
          ? String(request.category.id)
          : String(request.category)

      const matchesCategory =
        !selectedCategory || categoryId === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [requests, search, selectedCategory])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3 text-secondary">
          Loading help requests...
        </p>
      </div>
    )
  }

  return (
    <div className="container py-5">
      {/* Page heading */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold">Help Requests</h1>

          <p className="text-secondary mb-0">
            Ask questions, share your experience, and help others grow.
          </p>
        </div>

        <Link
          to="/help-requests/create"
          className="btn btn-primary"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create Help Request
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Search and category filter */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <label htmlFor="search" className="form-label">
                Search Help Requests
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  id="search"
                  type="search"
                  className="form-control"
                  placeholder="Search by title, description, or author..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label htmlFor="category" className="form-label">
                Filter by Category
              </label>

              <select
                id="category"
                className="form-select"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={String(category.id)}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Request count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Community Questions</h5>

        <span className="badge text-bg-primary">
          {filteredRequests.length} requests
        </span>
      </div>

      {/* Requests list */}
      {filteredRequests.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-chat-square-text display-4 text-secondary"></i>

            <h4 className="mt-3">No help requests found</h4>

            <p className="text-secondary">
              Try a different search or create a new help request.
            </p>

            <Link
              to="/help-requests/create"
              className="btn btn-primary"
            >
              Create Your First Request
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRequests.map((request) => {
            const categoryName =
              typeof request.category === 'object'
                ? request.category?.name
                : categories.find(
                    (category) =>
                      String(category.id) === String(request.category),
                  )?.name

            const authorName =
              typeof request.author === 'object'
                ? request.author?.username
                : request.author_username || 'Community member'

            const answerCount =
              request.answers_count ??
              request.answer_count ??
              request.answers?.length ??
              0

            return (
              <div
                className="col-12"
                key={request.id}
              >
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div className="flex-grow-1">
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          <span className="badge text-bg-light border">
                            {categoryName || 'Uncategorized'}
                          </span>

                          {request.is_solved ? (
                            <span className="badge text-bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Solved
                            </span>
                          ) : (
                            <span className="badge text-bg-warning">
                              Open
                            </span>
                          )}
                        </div>

                        <h4 className="fw-bold">
                          <Link
                            to={`/help-requests/${request.id}`}
                            className="text-dark"
                          >
                            {request.title}
                          </Link>
                        </h4>

                        <p className="text-secondary">
                          {request.description?.length > 220
                            ? `${request.description.slice(0, 220)}...`
                            : request.description}
                        </p>

                        <div className="small text-secondary d-flex flex-wrap gap-3">
                          <span>
                            <i className="bi bi-person me-1"></i>
                            {authorName}
                          </span>

                          <span>
                            <i className="bi bi-calendar3 me-1"></i>
                            {request.created_at
                              ? new Date(
                                  request.created_at,
                                ).toLocaleDateString()
                              : 'Date unavailable'}
                          </span>

                          <span>
                            <i className="bi bi-chat-dots me-1"></i>
                            {answerCount} answers
                          </span>
                        </div>
                      </div>

                      <div className="d-flex align-items-start">
                        <Link
                          to={`/help-requests/${request.id}`}
                          className="btn btn-outline-primary"
                        >
                          View Request
                          <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HelpRequests