function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand fw-bold fs-4" href="/">
            <i className="bi bi-people-fill me-2"></i>
            HelpNest
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="mainNavbar"
          >
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <a className="nav-link active" href="/">
                  Home
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>

              <li className="nav-item ms-lg-3">
                <a
                  className="btn btn-outline-light"
                  href="/login"
                >
                  Login
                </a>
              </li>

              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <a
                  className="btn btn-light text-primary fw-semibold"
                  href="/register"
                >
                  Join HelpNest
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-primary-subtle text-primary mb-3 p-2">
                Your Career. Your Community.
              </span>

              <h1 className="display-4 fw-bold mb-4">
                Your next opportunity starts with
                <span className="text-primary"> a connection.</span>
              </h1>

              <p className="lead text-secondary mb-4">
                Connect with alumni, find experienced mentors,
                ask career questions, and discover opportunities
                that help you move forward.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <a
                  href="/register"
                  className="btn btn-primary btn-lg"
                >
                  Get Started
                  <i className="bi bi-arrow-right ms-2"></i>
                </a>

                <a
                  href="#features"
                  className="btn btn-outline-secondary btn-lg"
                >
                  Explore Features
                </a>
              </div>

              <div className="d-flex flex-wrap gap-4 mt-5">
                <div>
                  <h4 className="fw-bold mb-1">Connect</h4>
                  <small className="text-secondary">
                    With experienced people
                  </small>
                </div>

                <div>
                  <h4 className="fw-bold mb-1">Learn</h4>
                  <small className="text-secondary">
                    From real experiences
                  </small>
                </div>

                <div>
                  <h4 className="fw-bold mb-1">Grow</h4>
                  <small className="text-secondary">
                    Toward your career goals
                  </small>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <div
                      className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '90px',
                        height: '90px',
                      }}
                    >
                      <i className="bi bi-people-fill fs-1"></i>
                    </div>

                    <h3 className="fw-bold">
                      A community that helps you grow
                    </h3>

                    <p className="text-secondary mb-0">
                      Your questions matter. Your experience
                      can help others.
                    </p>
                  </div>

                  <div className="d-flex align-items-start mb-4">
                    <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>

                    <div>
                      <h6 className="fw-bold mb-1">
                        Ask for help
                      </h6>

                      <p className="text-secondary mb-0">
                        Get guidance on jobs, freelancing,
                        and career planning.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-4">
                    <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>

                    <div>
                      <h6 className="fw-bold mb-1">
                        Learn from alumni
                      </h6>

                      <p className="text-secondary mb-0">
                        Discover how experienced professionals
                        built their careers.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>

                    <div>
                      <h6 className="fw-bold mb-1">
                        Share your knowledge
                      </h6>

                      <p className="text-secondary mb-0">
                        Help someone take their next step.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Everything you need to move forward
            </h2>

            <p className="text-secondary">
              Build connections, find answers, and explore
              career opportunities.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <i className="bi bi-chat-square-text text-primary fs-1"></i>

                  <h5 className="fw-bold mt-3">
                    Ask Questions
                  </h5>

                  <p className="text-secondary mb-0">
                    Post your questions about jobs, interviews,
                    freelancing, learning paths, and professional
                    development.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <i className="bi bi-mortarboard text-primary fs-1"></i>

                  <h5 className="fw-bold mt-3">
                    Connect with Alumni
                  </h5>

                  <p className="text-secondary mb-0">
                    Learn from graduates working in different
                    companies, industries, and professions.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <i className="bi bi-lightbulb text-primary fs-1"></i>

                  <h5 className="fw-bold mt-3">
                    Share Knowledge
                  </h5>

                  <p className="text-secondary mb-0">
                    Answer questions, share experiences, and
                    help other people make informed career
                    decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-5">
        <div className="container py-4 text-center">
          <h2 className="fw-bold mb-3">
            Your journey doesn't have to be a solo journey.
          </h2>

          <p className="lead text-secondary mx-auto mb-4">
            HelpNest brings people together to make career
            knowledge, guidance, and professional connections
            more accessible.
          </p>

          <a href="/register" className="btn btn-primary btn-lg">
            Become a Member
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="fw-bold fs-5">
              <i className="bi bi-people-fill me-2"></i>
              HelpNest
            </div>

            <p className="text-white-50 mb-0">
              Helping people grow, together.
            </p>

            <small className="text-white-50">
              © {new Date().getFullYear()} HelpNest
            </small>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App