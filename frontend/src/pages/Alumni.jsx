import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../api/axios'

function Alumni() {
  const [alumni, setAlumni] = useState([])

  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('')
  const [company, setCompany] = useState('')
  const [mentorship, setMentorship] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAlumni()
    }, 300)

    return () => clearTimeout(timer)
  }, [search, industry, company, mentorship])

  async function fetchAlumni() {
    setLoading(true)
    setError('')

    try {
      const params = {}

      if (search.trim()) {
        params.search = search.trim()
      }

      if (industry.trim()) {
        params.industry = industry.trim()
      }

      if (company.trim()) {
        params.company = company.trim()
      }

      if (mentorship) {
        params.mentorship = mentorship
      }

      const response = await api.get('accounts/alumni/', {
        params,
      })

      const data = response.data

      if (Array.isArray(data)) {
        setAlumni(data)
      } else if (Array.isArray(data.results)) {
        setAlumni(data.results)
      } else {
        setAlumni([])
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Unable to load alumni. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setSearch('')
    setIndustry('')
    setCompany('')
    setMentorship('')
  }

  function getProfileImage(profilePicture) {
    if (!profilePicture) {
      return null
    }

    if (profilePicture.startsWith('http')) {
      return profilePicture
    }

    const baseURL = import.meta.env.VITE_API_BASE_URL.replace(
      /\/api\/?$/,
      ''
    )

    return `${baseURL}${profilePicture.startsWith('/') ? '' : '/'}${profilePicture}`
  }

  return (
    <div className="container py-5">
      {/* Page heading */}
      <div className="mb-4">
        <h1 className="display-6 fw-bold">Alumni Directory</h1>
        <p className="text-muted">
          Connect with experienced professionals and discover career guidance from alumni.
        </p>
      </div>

      {/* Search and filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          {/* form ট্যাগ যোগ করা হয়েছে এবং onSubmit এ preventDefault দেওয়া হয়েছে */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row g-3">
              <div className="col-12 col-lg-6">
                <label htmlFor="alumniSearch" className="form-label">
                  Search alumni
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    id="alumniSearch"
                    type="text"
                    className="form-control"
                    placeholder="Name, company, job title, or skill"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="industryFilter" className="form-label">
                  Industry
                </label>
                <input
                  id="industryFilter"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Software Engineering"
                  value={industry}
                  onChange={(event) =>
                    setIndustry(event.target.value)
                  }
                />
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="companyFilter" className="form-label">
                  Company
                </label>
                <input
                  id="companyFilter"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Google"
                  value={company}
                  onChange={(event) =>
                    setCompany(event.target.value)
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="mentorshipFilter" className="form-label">
                  Mentorship availability
                </label>
                <select
                  id="mentorshipFilter"
                  className="form-select"
                  value={mentorship}
                  onChange={(event) =>
                    setMentorship(event.target.value)
                  }
                >
                  <option value="">All alumni</option>
                  <option value="true">Available for mentorship</option>
                  <option value="false">Not available for mentorship</option>
                </select>
              </div>

              <div className="col-12 col-md-6 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="h4 fw-bold mb-0">Explore Alumni</h2>
        {!loading && (
          <span className="text-muted">
            {alumni.length}{' '}
            {alumni.length === 1 ? 'profile' : 'profiles'} found
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Finding alumni...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="alert alert-danger">
          {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchAlumni}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Alumni cards */}
      {!loading && !error && alumni.length > 0 && (
        <div className="row g-4">
          {alumni.map((person) => (
            <div
              className="col-12 col-md-6 col-xl-4"
              key={person.id}
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  {/* Profile header */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {person.profile_picture ? (
                      <img
                        src={getProfileImage(person.profile_picture)}
                        alt={person.full_name}
                        className="rounded-circle"
                        style={{
                          width: '70px',
                          height: '70px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '70px',
                          height: '70px',
                          fontSize: '1.5rem',
                        }}
                      >
                        <i className="bi bi-person-fill"></i>
                      </div>
                    )}

                    <div className="overflow-hidden">
                      <h3 className="h5 fw-bold mb-1 text-break">
                        {person.full_name || person.username}
                      </h3>
                      <div className="small text-muted text-break">
                        @{person.username}
                      </div>
                    </div>
                  </div>

                  {/* Job details */}
                  {person.job_title && (
                    <p className="mb-2">
                      <i className="bi bi-briefcase me-2 text-primary"></i>
                      <span className="fw-semibold">
                        {person.job_title}
                      </span>
                    </p>
                  )}

                  {person.company && (
                    <p className="text-muted mb-2">
                      <i className="bi bi-building me-2"></i>
                      {person.company}
                    </p>
                  )}

                  {/* Education */}
                  {(person.institution || person.department) && (
                    <p className="text-muted mb-2">
                      <i className="bi bi-mortarboard me-2"></i>
                      {[person.department, person.institution]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}

                  {person.graduation_year && (
                    <p className="text-muted mb-3">
                      <i className="bi bi-calendar3 me-2"></i>
                      Graduated {person.graduation_year}
                    </p>
                  )}

                  {/* Industry */}
                  {person.industry && (
                    <div className="mb-3">
                      <span className="badge bg-light text-dark border">
                        {person.industry}
                      </span>
                    </div>
                  )}

                  {/* Biography */}
                  {person.bio && (
                    <p className="text-muted small mb-3">
                      {person.bio.length > 120
                        ? `${person.bio.slice(0, 120)}...`
                        : person.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {person.skills && (
                    <div className="mb-3">
                      <div className="small fw-semibold mb-2">
                        Skills
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {person.skills
                          .split(',')
                          .map((skill) => skill.trim())
                          .filter(Boolean)
                          .slice(0, 5)
                          .map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="badge bg-primary-subtle text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Mentorship status */}
                  <div className="mb-3">
                    {person.is_available_for_mentorship ? (
                      <span className="text-success small fw-semibold">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Available for mentorship
                      </span>
                    ) : (
                      <span className="text-muted small">
                        <i className="bi bi-clock me-2"></i>
                        Mentorship unavailable
                      </span>
                    )}
                  </div>

                  {/* Profile action */}
                  <div className="d-grid mt-auto">
                    <Link
                      to={`/alumni/${person.user_id || person.id}`}
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-person-lines-fill me-2"></i>
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty results */}
      {!loading && !error && alumni.length === 0 && (
        <div className="card border-0 bg-light">
          <div className="card-body text-center py-5">
            <i className="bi bi-people display-4 text-muted"></i>
            <h3 className="h5 mt-3">No alumni found</h3>
            <p className="text-muted">
              Try different search terms or clear your filters.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Alumni