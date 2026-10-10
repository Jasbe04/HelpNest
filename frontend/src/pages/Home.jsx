import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <section className="bg-white py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-primary-subtle text-primary mb-3 p-2">
                Your Career. Your Community.
              </span>

              <h1 className="display-4 fw-bold mb-4">
                Your next opportunity starts with{' '}
                <span className="text-primary">
                  a connection.
                </span>
              </h1>

              <p className="lead text-secondary mb-4">
                Connect with alumni, find mentors, ask career
                questions, and discover opportunities that
                help you move forward.
              </p>

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary btn-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg"
                >
                  Join HelpNest
                </Link>
              )}
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <i className="bi bi-people-fill display-1 text-primary"></i>

                  <h3 className="fw-bold mt-4">
                    Grow Together
                  </h3>

                  <p className="text-secondary mb-0">
                    Share knowledge, find guidance, and help
                    others build their future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <i className="bi bi-chat-dots fs-1 text-primary"></i>

                <h5 className="fw-bold mt-3">
                  Ask for Help
                </h5>

                <p className="text-secondary mb-0">
                  Get answers to your career and professional
                  development questions.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <i className="bi bi-mortarboard fs-1 text-primary"></i>

                <h5 className="fw-bold mt-3">
                  Learn from Alumni
                </h5>

                <p className="text-secondary mb-0">
                  Discover insights from people who have
                  experience in your target career.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <i className="bi bi-lightbulb fs-1 text-primary"></i>

                <h5 className="fw-bold mt-3">
                  Share Knowledge
                </h5>

                <p className="text-secondary mb-0">
                  Help other members through your knowledge
                  and experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home