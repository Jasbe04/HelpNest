import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Alumni from './pages/Alumni'
import AlumniProfileDetail from './pages/AlumniProfileDetail'
import HelpRequests from './pages/HelpRequests'
import CreateHelpRequest from './pages/CreateHelpRequest'
import HelpRequestDetail from './pages/HelpRequestDetail'
import MentorshipRequestForm from './pages/MentorshipRequestForm'
import MyMentorshipRequests from './pages/MyMentorshipRequests'
import ReceivedMentorshipRequests from './pages/ReceivedMentorshipRequests'
import NotificationsPage from './pages/NotificationsPage'
import MentorshipRequestDetails from './pages/MentorshipRequestDetails'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Help Requests Directory */}
        <Route path="/help-requests" element={<HelpRequests />} />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* User Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Alumni */}
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/alumni/:id" element={<AlumniProfileDetail />} />

          {/* Create Help Request (MUST come before /help-requests/:id) */}
          <Route path="/help-requests/create" element={<CreateHelpRequest />} />

          {/* Help Request Detail */}
          <Route path="/help-requests/:id" element={<HelpRequestDetail />} />

          {/* Submit Mentorship Request */}
          <Route
            path="/mentorship/request/:mentorId"
            element={<MentorshipRequestForm />}
          />

          {/* Student: Sent Mentorship Requests */}
          <Route path="/my-mentorships" element={<MyMentorshipRequests />} />

          {/* Alumni: Received Mentorship Requests */}
          <Route
            path="/received-mentorships"
            element={<ReceivedMentorshipRequests />}
          />

          {/* Mentorship Request Details */}
          <Route
            path="/mentorship/requests/:requestId"
            element={<MentorshipRequestDetails />}
          />

          {/* Notifications */}
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App