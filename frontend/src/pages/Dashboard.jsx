import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    studentsCount: 0,
    alumniCount: 0,
    loading: true,
  });

  useEffect(() => {
    // Fetch platform stats if user is staff/admin, or personal metrics
    async function fetchDashboardData() {
      try {
        if (user?.is_staff || user?.is_superuser) {
          const res = await api.get("accounts/admin/users/");
          const usersList = res.data.results || res.data;
          const students = usersList.filter((u) => u.account_type === "student").length;
          const alumni = usersList.filter((u) => u.account_type === "alumni").length;
          setStats({
            totalUsers: usersList.length,
            studentsCount: students,
            alumniCount: alumni,
            loading: false,
          });
        } else {
          // For regular students/alumni, we can simulate or fetch relevant stats
          setStats({
            totalUsers: 0,
            studentsCount: 0,
            alumniCount: 0,
            loading: false,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const isAdmin = user?.is_staff || user?.is_superuser;
  const isStudent = user?.account_type === "student";
  const isAlumni = user?.account_type === "alumni";

  return (
    <div className="container py-5">
      {/* Welcome Banner */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm bg-primary text-white p-4 p-md-5 rounded-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <span className="badge bg-light text-primary fw-bold px-3 py-2 rounded-pill mb-2 text-uppercase">
                  {isAdmin ? "Administrator" : isStudent ? "Student Scholar" : "Alumni Mentor"}
                </span>
                <h1 className="fw-bold display-6 mb-1">
                  Welcome back, {user?.first_name || user?.username}!
                </h1>
                <p className="text-white-50 mb-0">
                  {isAdmin
                    ? "Here is an overview of platform activity and user statistics."
                    : isStudent
                    ? "Connect with alumni mentors and find the academic or career guidance you need."
                    : "Manage mentorship requests and help guide the next generation of students."}
                </p>
              </div>
              <div>
                <Link to="/profile" className="btn btn-light fw-semibold px-4 py-2 shadow-sm">
                  <i className="bi bi-gear-fill me-2"></i>Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row (Visible for Admin or general metrics) */}
      {isAdmin && (
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 border-start border-4 border-primary">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted text-uppercase small fw-bold mb-1">Total Users</p>
                  <h3 className="fw-bold mb-0">{stats.loading ? "..." : stats.totalUsers}</h3>
                </div>
                <div className="bg-primary bg-opacity-15 p-3 rounded-circle text-primary fs-4">
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 border-start border-4 border-info">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted text-uppercase small fw-bold mb-1">Registered Students</p>
                  <h3 className="fw-bold mb-0">{stats.loading ? "..." : stats.studentsCount}</h3>
                </div>
                <div className="bg-info bg-opacity-15 p-3 rounded-circle text-info fs-4">
                  <i className="bi bi-mortarboard-fill"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 border-start border-4 border-success">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted text-uppercase small fw-bold mb-1">Alumni Mentors</p>
                  <h3 className="fw-bold mb-0">{stats.loading ? "..." : stats.alumniCount}</h3>
                </div>
                <div className="bg-success bg-opacity-15 p-3 rounded-circle text-success fs-4">
                  <i className="bi bi-briefcase-fill"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions & Account Details Grid */}
      <div className="row g-4">
        {/* Account Details Card */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 p-md-4">
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-person-badge text-primary"></i> Account Details
              </h4>
              <hr className="text-muted opacity-25" />
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Username</span>
                  <span className="fw-semibold">{user?.username}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Email Address</span>
                  <span className="fw-semibold">{user?.email}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Account Type</span>
                  <span className="badge bg-secondary text-capitalize">{user?.account_type}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Activity Status</span>
                  <span className="badge bg-success bg-opacity-15 text-success px-2 py-1">
                    <i className="bi bi-circle-fill small me-1"></i> Active Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Card */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 p-md-4">
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge-fill text-warning"></i> Quick Actions
              </h4>
              <hr className="text-muted opacity-25" />
              <div className="d-flex flex-column gap-3">
                <Link to="/alumni" className="btn btn-outline-primary text-start p-3 rounded-3 d-flex align-items-center justify-content-between">
                  <div>
                    <i className="bi bi-search me-2"></i> Browse Alumni Directory
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </Link>

                <Link to="/help-requests" className="btn btn-outline-primary text-start p-3 rounded-3 d-flex align-items-center justify-content-between">
                  <div>
                    <i className="bi bi-question-circle me-2"></i> View Community Help Requests
                  </div>
                  <i className="bi bi-chevron-right"></i>
                </Link>

                {isAdmin && (
                  <Link to="/admin-dashboard" className="btn btn-warning text-dark text-start p-3 rounded-3 d-flex align-items-center justify-content-between fw-semibold">
                    <div>
                      <i className="bi bi-shield-lock me-2"></i> Open Admin Control Panel
                    </div>
                    <i className="bi bi-chevron-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}