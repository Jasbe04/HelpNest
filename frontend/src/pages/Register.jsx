import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    account_type: 'student', // <-- Default account type added
    password: '',
    password2: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
    setSuccess('')

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    try {
      await register(formData)

      setSuccess('Account created successfully. Please log in.')

      navigate('/login', {
        replace: true,
        state: {
          message: 'Account created successfully. Please log in.',
        },
      })
    } catch (err) {
      const data = err.response?.data

      if (data && typeof data === 'object') {
        const messages = Object.entries(data)
          .map(([field, value]) => {
            const details = Array.isArray(value)
              ? value.join(' ')
              : String(value)

            return `${field}: ${details}`
          })
          .join('\n')

        setError(messages || 'Registration failed.')
      } else {
        setError(
          'Unable to connect to the server. Please try again.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <i className="bi bi-people-fill text-primary display-4"></i>

                <h2 className="fw-bold mt-3">
                  Join HelpNest
                </h2>

                <p className="text-secondary">
                  Create an account and start connecting.
                </p>
              </div>

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="form-label"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Account Type Selection */}
                <div className="mb-3">
                  <label
                    htmlFor="account_type"
                    className="form-label"
                  >
                    I am a
                  </label>
                  <select
                    id="account_type"
                    name="account_type"
                    className="form-select"
                    value={formData.account_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password2"
                    className="form-label"
                  >
                    Confirm password
                  </label>

                  <input
                    id="password2"
                    type="password"
                    name="password2"
                    className="form-control"
                    placeholder="Enter your password again"
                    value={formData.password2}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Creating account...'
                    : 'Create Account'}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                Already have an account?{' '}
                <Link to="/login" className="fw-semibold">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register