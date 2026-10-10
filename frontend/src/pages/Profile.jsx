import { useEffect, useState } from 'react'

import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { accessToken } = useAuth()

  const [profile, setProfile] = useState({
    account_type: '', // <-- Track account type
    bio: '',
    institution: '',
    department: '',
    graduation_year: '',
    current_term: '', // <-- Added for students
    company: '',
    job_title: '',
    industry: '',
    skills: '',
    is_available_for_mentorship: false,
  })

  const [profilePicture, setProfilePicture] = useState(null)
  const [currentPictureUrl, setCurrentPictureUrl] = useState('')
  const [picturePreview, setPicturePreview] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load the current user's profile.
  useEffect(() => {
    let cancelled = false

    async function fetchProfile() {
      try {
        const response = await api.get('accounts/me/profile/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (cancelled) return

        const data = response.data

        setProfile({
          account_type: data.account_type || '',
          bio: data.bio || '',
          institution: data.institution || '',
          department: data.department || '',
          graduation_year: data.graduation_year ?? '',
          current_term: data.current_term || '',
          company: data.company || '',
          job_title: data.job_title || '',
          industry: data.industry || '',
          skills: data.skills || '',
          is_available_for_mentorship:
            data.is_available_for_mentorship ?? false,
        })

        setCurrentPictureUrl(data.profile_picture || '')
      } catch (err) {
        if (!cancelled) {
          console.error(
            'Profile loading error:',
            err.response?.data || err,
          )

          setError('Unable to load your profile.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (accessToken) {
      fetchProfile()
    } else {
      setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [accessToken])

  // Create a temporary preview when a new image is selected.
  useEffect(() => {
    if (!profilePicture) {
      setPicturePreview('')
      return
    }

    const previewUrl = URL.createObjectURL(profilePicture)

    setPicturePreview(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [profilePicture])

  // Handle text inputs and checkboxes.
  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setProfile((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Handle image selection.
  function handleImageChange(event) {
    const file = event.target.files?.[0] || null

    setProfilePicture(file)
    setError('')
    setSuccess('')
  }

  // Submit the updated profile.
  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const formData = new FormData()

      Object.entries(profile).forEach(([key, value]) => {
        // Do not transmit account_type back since it's read-only/managed by user model
        if (key !== 'account_type') {
          formData.append(key, String(value))
        }
      })

      // Only send a file when the user selects a new picture.
      if (profilePicture) {
        formData.append('profile_picture', profilePicture)
      }

      const response = await api.patch(
        'accounts/me/profile/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      // Update the displayed picture with the saved image URL.
      setCurrentPictureUrl(response.data.profile_picture || '')
      setProfilePicture(null)

      setSuccess('Your profile has been updated successfully.')
    } catch (err) {
      const data = err.response?.data

      console.error('Profile update error:', data || err)

      if (data && typeof data === 'object') {
        const messages = Object.entries(data).map(([field, messages]) => {
          const details = Array.isArray(messages)
            ? messages.join(' ')
            : String(messages)

          return `${field}: ${details}`
        })

        setError(messages.join(' | '))
      } else {
        setError('Unable to update your profile. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="mt-3">Loading profile...</p>
      </div>
    )
  }

  const displayedPicture = picturePreview || currentPictureUrl
  const isStudent = profile.account_type === 'student'
  const isAlumni = profile.account_type === 'alumni'

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="fw-bold mb-0">My Profile</h2>
                <span className={`badge ${isStudent ? 'bg-info' : 'bg-success'}`}>
                  {profile.account_type ? profile.account_type.toUpperCase() : ''}
                </span>
              </div>

              <p className="text-secondary mb-4">
                Share information about your education, career, and interests.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Profile Picture */}
                <div className="mb-4">
                  <label className="form-label d-block">
                    Profile Picture
                  </label>

                  {displayedPicture && (
                    <div className="mb-3">
                      <img
                        src={displayedPicture}
                        alt="Profile"
                        className="rounded-circle border"
                        style={{
                          width: '130px',
                          height: '130px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}

                  <input
                    id="profile_picture"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="form-control"
                    onChange={handleImageChange}
                  />

                  <div className="form-text">
                    Choose a JPG, PNG, or WebP image.
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    className="form-control"
                    rows="4"
                    value={profile.bio}
                    onChange={handleChange}
                  />
                </div>

                {/* Institution */}
                <div className="mb-3">
                  <label htmlFor="institution" className="form-label">
                    Institution
                  </label>

                  <input
                    id="institution"
                    name="institution"
                    className="form-control"
                    value={profile.institution}
                    onChange={handleChange}
                  />
                </div>

                {/* Department */}
                <div className="mb-3">
                  <label htmlFor="department" className="form-label">
                    Department
                  </label>

                  <input
                    id="department"
                    name="department"
                    className="form-control"
                    value={profile.department}
                    onChange={handleChange}
                  />
                </div>

                {/* Graduation Year */}
                <div className="mb-3">
                  <label htmlFor="graduation_year" className="form-label">
                    Graduation Year
                  </label>

                  <input
                    id="graduation_year"
                    name="graduation_year"
                    type="number"
                    min="1900"
                    max="2100"
                    className="form-control"
                    value={profile.graduation_year}
                    onChange={handleChange}
                  />
                </div>

                {/* Student-specific field */}
                {isStudent && (
                  <div className="mb-3">
                    <label htmlFor="current_term" className="form-label">
                      Current Academic Term / Year
                    </label>

                    <input
                      id="current_term"
                      name="current_term"
                      className="form-control"
                      placeholder="e.g. Fall 2026, Year 3"
                      value={profile.current_term}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* Alumni-specific fields */}
                {isAlumni && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="company" className="form-label">
                        Company
                      </label>

                      <input
                        id="company"
                        name="company"
                        className="form-control"
                        value={profile.company}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="job_title" className="form-label">
                        Job Title
                      </label>

                      <input
                        id="job_title"
                        name="job_title"
                        className="form-control"
                        value={profile.job_title}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="industry" className="form-label">
                        Industry
                      </label>

                      <input
                        id="industry"
                        name="industry"
                        className="form-control"
                        value={profile.industry}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {/* Skills */}
                <div className="mb-3">
                  <label htmlFor="skills" className="form-label">
                    Skills
                  </label>

                  <textarea
                    id="skills"
                    name="skills"
                    className="form-control"
                    rows="3"
                    placeholder="Python, Django, React..."
                    value={profile.skills}
                    onChange={handleChange}
                  />
                </div>

                {/* Mentorship Availability (Alumni Only) */}
                {isAlumni && (
                  <div className="form-check mb-4">
                    <input
                      id="is_available_for_mentorship"
                      name="is_available_for_mentorship"
                      type="checkbox"
                      className="form-check-input"
                      checked={profile.is_available_for_mentorship}
                      onChange={handleChange}
                    />

                    <label
                      htmlFor="is_available_for_mentorship"
                      className="form-check-label"
                    >
                      I am available for mentorship
                    </label>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile