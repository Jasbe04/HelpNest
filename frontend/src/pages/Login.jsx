import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const { login } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const message = location.state?.message

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
      await login(
        formData.username,
        formData.password,
      )

      const destination = location.state?.from

      navigate(
        destination
          ? `${destination.pathname || '/dashboard'}${destination.search || ''}${destination.hash || ''}`
          : '/dashboard',
        { replace: true },
      )
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Incorrect username or password.')
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError(
          'Unable to log in. Check your connection and try again.',
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
                <i className="bi bi-person-circle text-primary display-4"></i>

                <h2 className="fw-bold mt-3">
                  Welcome Back
                </h2>

                <p className="text-secondary">
                  Log in to continue your HelpNest journey.
                </p>
              </div>

              {message && (
                <div className="alert alert-success">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
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
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="mb-4">
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={submitting}
                >
                  {submitting ? 'Logging in...' : 'Log In'}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="fw-semibold">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login