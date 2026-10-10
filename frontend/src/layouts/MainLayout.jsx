import { Link, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Content (Grows to push footer down) */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Professional Sticky Footer */}
      <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
        <div className="container">
          <div className="row g-4 pb-4 border-bottom border-secondary border-opacity-50">
            {/* Brand Column */}
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-people-fill small"></i>
                </div>
                <h5 className="fw-bold mb-0 text-white">HelpNest</h5>
              </div>
              <p className="text-white-50 small mb-3">
                Connecting university students with experienced alumni for career guidance, academic support, and lifelong mentorship.
              </p>
              <div className="d-flex gap-3">
                <a href="https://github.com/Jasbe04/" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none hover-white">
                  <i className="bi bi-github fs-5"></i>
                </a>
                <a href="https://www.linkedin.com/in/tahmid-hossain-jasbe-719205307/?isSelfProfile=true" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none hover-white">
                  <i className="bi bi-linkedin fs-5"></i>
                </a>
                <a href="https://x.com/Jasbe04" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none hover-white">
                  <i className="bi bi-twitter-x fs-5"></i>
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold text-white mb-3 text-uppercase small tracking-wide">Platform</h6>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                <li>
                  <Link to="/" className="text-white-50 text-decoration-none">Home</Link>
                </li>
                <li>
                  <Link to="/help-requests" className="text-white-50 text-decoration-none">Help Requests</Link>
                </li>
                <li>
                  <Link to="/alumni" className="text-white-50 text-decoration-none">Alumni Directory</Link>
                </li>
              </ul>
            </div>

            {/* Support / Community Column */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-white mb-3 text-uppercase small tracking-wide">Community</h6>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                <li>
                  <span className="text-white-50">Student Guidance</span>
                </li>
                <li>
                  <span className="text-white-50">Alumni Mentorship</span>
                </li>
                <li>
                  <span className="text-white-50">Networking Events</span>
                </li>
              </ul>
            </div>

            {/* Developer Credit Info */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-white mb-3 text-uppercase small tracking-wide">Developer</h6>
              <p className="text-white-50 small mb-2">
                Designed & Developed with excellence for the HelpNest community.
              </p>
              <div className="p-2 bg-secondary bg-opacity-25 rounded border border-secondary border-opacity-50">
                <span className="d-block text-white fw-semibold small">Tahmid Hossain Jasbe</span>
                <small className="text-primary-subtle">Lead Engineer / Creator</small>
              </div>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-white-50">
            <div>
              &copy; {new Date().getFullYear()} HelpNest. All rights reserved.
            </div>
            <div>
              Built with <i className="bi bi-heart-fill text-danger mx-1"></i> by <span className="text-white fw-semibold">Tahmid Hossain Jasbe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout