import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios' // api ইমপোর্ট করা হলো নোটিফিকেশন ফেচ করার জন্য

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  
  // আনরিড নোটিফিকেশন কাউন্ট রাখার জন্য স্টেট
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadNotificationsCount()
    } else {
      setUnreadCount(0)
    }
  }, [isAuthenticated])

  async function fetchUnreadNotificationsCount() {
    try {
      // আপনার ব্যাকএন্ডের নোটিফিকেশন কাউন্ট বা আনরিড নোটিফিকেশন এপিআই রুট এখানে দিন
      const response = await api.get('notifications/unread-count/') 
      setUnreadCount(response.data.unread_count || response.data.count || 0)
    } catch (err) {
      console.error('Failed to fetch unread notifications count', err)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active fw-semibold' : ''}`

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold text-primary"
          to="/"
        >
          <i className="bi bi-people-fill me-2"></i>
          HelpNest
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#helpNestNavbar"
          aria-controls="helpNestNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="helpNestNavbar"
        >
          {/* Main navigation */}
          <div className="navbar-nav me-auto">
            <NavLink
              to="/"
              className={navLinkClass}
              end
            >
              Home
            </NavLink>

            <NavLink
              to="/help-requests"
              className={navLinkClass}
            >
              Help Requests
            </NavLink>

            <NavLink
              to="/alumni"
              className={navLinkClass}
            >
              <i className="bi bi-people me-1"></i>
              Alumni
            </NavLink>

            {/* Authenticated user navigation */}
            {isAuthenticated && (
              <>
                {/* Student navigation */}
                {user?.account_type === 'student' && (
                  <NavLink
                    to="/my-mentorships"
                    className={navLinkClass}
                  >
                    <i className="bi bi-journal-check me-1"></i>
                    My Mentorships
                  </NavLink>
                )}

                {/* Alumni navigation */}
                {user?.account_type === 'alumni' && (
                  <NavLink
                    to="/received-mentorships"
                    className={navLinkClass}
                  >
                    <i className="bi bi-inbox me-1"></i>
                    Received Requests
                  </NavLink>
                )}

                {/* Notifications with unread count badge */}
                <NavLink
                  to="/notifications"
                  className={navLinkClass}
                >
                  <i className="bi bi-bell me-1"></i>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="badge bg-danger rounded-pill ms-2 px-2 py-1" style={{ fontSize: '0.75rem' }}>
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              </>
            )}
          </div>

          {/* Right-side actions */}
          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-secondary small">
                  Hello, {user?.username}
                </span>

                {/* Create Help Request: students only */}
                {user?.account_type === 'student' && (
                  <Link
                    to="/help-requests/create"
                    className="btn btn-primary btn-sm"
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Create Request
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="btn btn-outline-secondary btn-sm"
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  My Profile
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar