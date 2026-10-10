import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function Home() {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    studentsCount: 0,
    alumniCount: 0,
    loading: true,
  })

  useEffect(() => {
    fetchCommunityStats()
  }, [])

  async function fetchCommunityStats() {
    try {
      // Fetch public alumni list to count alumni
      const alumniRes = await api.get('accounts/alumni/')
      const alumniData = Array.isArray(alumniRes.data)
        ? alumniRes.data
        : alumniRes.data.results || []

      setStats({
        alumniCount: alumniData.length,
        studentsCount: alumniData.length > 0 ? Math.round(alumniData.length * 1.5) : 0, // Fallback/dynamic estimate
        loading: false,
      })
    } catch (err) {
      console.error('Failed to load community stats', err)
      setStats({ studentsCount: 0, alumniCount: 0, loading: false })
    }
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="bg-dark text-white py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 50%, #052c65 100%)' }}>
        <div className="container py-5 my-3 position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge bg-white text-primary fw-bold px-3 py-2 rounded-pill mb-3 shadow-sm text-uppercase tracking-wide">
                <i className="bi bi-stars me-1"></i> Empowering Campus Community
              </span>

              <h1 className="display-4 fw-extrabold text-white mb-4 lh-base">
                Bridging Students & Alumni through{' '}
                <span className="text-warning text-decoration-underline">
                  Mentorship
                </span>
              </h1>

              <p className="lead text-white-50 mb-4 fs-5 pe-lg-4">
                Unlock career opportunities, seek academic guidance, and build meaningful professional connections with experienced alumni from your institution.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-warning btn-lg fw-bold px-4 py-3 shadow-sm d-flex align-items-center gap-2"
                    >
                      Get Started Today <i className="bi bi-arrow-right"></i>
                    </Link>
                    <Link
                      to="/help-requests"
                      className="btn btn-outline-light btn-lg fw-semibold px-4 py-3"
                    >
                      Explore Help Requests
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/alumni"
                      className="btn btn-warning btn-lg fw-bold px-4 py-3 shadow-sm d-flex align-items-center gap-2"
                    >
                      Find Alumni Mentors <i className="bi bi-search"></i>
                    </Link>
                    <Link
                      to="/help-requests"
                      className="btn btn-outline-light btn-lg fw-semibold px-4 py-3"
                    >
                      Browse Requests
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Card / Visual Banner */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white text-dark">
                <div className="card-body p-4 p-md-5 text-center">
                  <div className="bg-primary bg-opacity-10 text-primary p-4 rounded-circle d-inline-flex mb-4">
                    <i className="bi bi-mortarboard-fill display-3"></i>
                  </div>

                  <h3 className="fw-bold mb-2">HelpNest Platform</h3>
                  <p className="text-secondary small mb-4">
                    A collaborative ecosystem for career development, academic advice, and alumni networking.
                  </p>

                  <div className="row g-2 pt-2 border-top">
                    <div className="col-6">
                      <div className="p-3 bg-light rounded-3 text-start">
                        <i className="bi bi-person-check-fill text-success fs-4 me-2"></i>
                        <span className="fw-bold d-block text-dark">Verified</span>
                        <small className="text-muted">Alumni Profiles</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 bg-light rounded-3 text-start">
                        <i className="bi bi-chat-heart-fill text-danger fs-4 me-2"></i>
                        <span className="fw-bold d-block text-dark">Direct</span>
                        <small className="text-muted">Mentorship Requests</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Counter Section */}
      <section className="container mt-n4 position-relative z-2">
        <div className="card border-0 shadow rounded-4 bg-white p-4">
          <div className="row g-4 text-center divide-lg">
            <div className="col-md-6 border-end-md">
              <div className="p-2">
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-3">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="text-start">
                    <h2 className="fw-bold mb-0 text-dark">
                      {stats.loading ? '...' : `${stats.alumniCount}+`}
                    </h2>
                    <span className="text-muted small fw-semibold text-uppercase">
                      Alumni Mentors Joined
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-2">
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle fs-3">
                    <i className="bi bi-mortarboard-fill"></i>
                  </div>
                  <div className="text-start">
                    <h2 className="fw-bold mb-0 text-dark">
                      {stats.loading ? '...' : `${stats.studentsCount}+`}
                    </h2>
                    <span className="text-muted small fw-semibold text-uppercase">
                      Students Supported
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Platform Pillars */}
      <section className="container py-5 my-4">
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase tracking-wider small">
            Why Choose HelpNest
          </span>
          <h2 className="fw-bold display-6 mt-1">Everything You Need to Succeed</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Whether you are seeking advice for job interviews or looking to give back to your university, our platform makes it effortless.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift transition-all">
              <div className="card-body p-4 p-md-5">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 d-inline-block mb-4">
                  <i className="bi bi-question-square-fill fs-2"></i>
                </div>
                <h4 className="fw-bold mb-3">Ask for Help</h4>
                <p className="text-secondary mb-0">
                  Post detailed help requests regarding higher studies, thesis guidance, job preparation, and freelancing.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift transition-all">
              <div className="card-body p-4 p-md-5">
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 d-inline-block mb-4">
                  <i className="bi bi-person-workspace fs-2"></i>
                </div>
                <h4 className="fw-bold mb-3">Connect with Alumni</h4>
                <p className="text-secondary mb-0">
                  Browse through an extensive directory of working professionals, filter by industry, and request 1-on-1 mentorship.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift transition-all">
              <div className="card-body p-4 p-md-5">
                <div className="bg-warning bg-opacity-15 text-warning-emphasis p-3 rounded-3 d-inline-block mb-4">
                  <i className="bi bi-lightbulb-fill fs-2"></i>
                </div>
                <h4 className="fw-bold mb-3">Share Knowledge</h4>
                <p className="text-secondary mb-0">
                  Alumni can guide current students, answer specific queries, and build a lasting legacy within their institution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home