import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h1 className="fw-bold">
            Welcome, {user?.first_name || user?.username}!
          </h1>

          <p className="text-secondary">
            Welcome to your HelpNest dashboard.
          </p>

          <hr />

          <h5 className="fw-semibold">Your Account</h5>

          <p className="mb-2">
            <strong>Username:</strong> {user?.username}
          </p>

          <p className="mb-4">
            <strong>Email:</strong> {user?.email}
          </p>

          <Link to="/profile" className="btn btn-primary">
            Manage Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard