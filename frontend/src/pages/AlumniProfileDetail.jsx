import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext' // ১. AuthContext ইমপোর্ট করা হলো

function AlumniProfileDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth() // ২. বর্তমান ইউজারের ডেটা নেওয়া হলো

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfileDetail()
  }, [id])

  async function fetchProfileDetail() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get(`accounts/alumni/${id}/`)
      setProfile(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Failed to load alumni profile details.'
      )
    } finally {
      setLoading(false)
    }
  }

  function getProfileImage(profilePicture) {
    if (!profilePicture) return null
    if (profilePicture.startsWith('http')) return profilePicture
    const baseURL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
    return `${baseURL}${profilePicture.startsWith('/') ? '' : '/'}${profilePicture}`
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || 'Profile not found.'}
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate('/alumni')}
        >
          <i className="bi bi-arrow-left me-2"></i> Back to Alumni Directory
        </button>
      </div>
    )
  }

  return (
    <div className="container py-5">
      {/* Back button */}
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mb-4"
        onClick={() => navigate('/alumni')}
      >
        <i className="bi bi-arrow-left me-2"></i> Back to Directory
      </button>

      <div className="card border-0 shadow-sm overflow-hidden mb-4">
        {/* Header Section */}
        <div className="bg-primary bg-opacity-10 p-4 p-md-5">
          <div className="row align-items-center g-4">
            <div className="col-auto">
              {profile.profile_picture ? (
                <img
                  src={getProfileImage(profile.profile_picture)}
                  alt={profile.full_name}
                  className="rounded-circle border border-white border-3 shadow"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow"
                  style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>
              )}
            </div>

            <div className="col">
              <h1 className="h3 fw-bold mb-1">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-muted mb-2">@{profile.username}</p>
              {profile.job_title && profile.company && (
                <p className="mb-0 fw-semibold text-primary">
                  {profile.job_title} at {profile.company}
                </p>
              )}
            </div>

            <div className="col-12 col-md-auto">
              {profile.is_available_for_mentorship ? (
                <div className="d-flex flex-column align-items-start align-items-md-end gap-3">
                  <span className="badge bg-success px-3 py-2 fs-6">
                    <i className="bi bi-check-circle-fill me-1"></i>
                    Available for Mentorship
                  </span>

                  {/* ৩. শুধুমাত্র ইউজার যদি 'student' হয়, তবেই রিকোয়েস্ট বাটনটি দেখাবে */}
                  {user?.account_type === 'student' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/mentorship/request/${id}`)}
                    >
                      <i className="bi bi-chat-dots me-2"></i>
                      Request Mentorship
                    </button>
                  )}
                </div>
              ) : (
                <span className="badge bg-secondary px-3 py-2 fs-6">
                  <i className="bi bi-clock me-1"></i>
                  Mentorship Unavailable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="card-body p-4 p-md-5">
          <div className="row g-4">
            {/* Main Info */}
            <div className="col-lg-8">
              <h4 className="h5 fw-bold mb-3">About</h4>
              <p className="text-secondary mb-4" style={{ whiteSpace: 'pre-line' }}>
                {profile.bio || 'No biography has been added yet.'}
              </p>

              <h4 className="h5 fw-bold mb-3">Skills & Expertise</h4>
              {profile.skills ? (
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {profile.skills
                    .split(',')
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                      <span
                        key={index}
                        className="badge bg-primary-subtle text-primary px-3 py-2"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-muted">No skills listed.</p>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="col-lg-4">
              <div className="card bg-light border-0 p-4">
                <h5 className="fw-bold mb-3">Professional & Academic</h5>

                {profile.industry && (
                  <div className="mb-3">
                    <span className="text-muted small d-block">Industry</span>
                    <span className="fw-semibold text-dark">{profile.industry}</span>
                  </div>
                )}

                {(profile.institution || profile.department) && (
                  <div className="mb-3">
                    <span className="text-muted small d-block">Education</span>
                    <span className="fw-semibold text-dark">
                      {[profile.department, profile.institution]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </div>
                )}

                {profile.graduation_year && (
                  <div className="mb-3">
                    <span className="text-muted small d-block">Graduation Year</span>
                    <span className="fw-semibold text-dark">
                      {profile.graduation_year}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlumniProfileDetail