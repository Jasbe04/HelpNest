import api from '../api/axios'

// Create a mentorship request
export const createMentorshipRequest = (data) => {
  return api.post('mentorship/requests/', data)
}

// Get requests sent by the logged-in student
export const getSentRequests = () => {
  return api.get('mentorship/requests/sent/')
}

// Get requests received by the logged-in alumnus
export const getReceivedRequests = () => {
  return api.get('mentorship/requests/received/')
}

// Accept or reject a mentorship request
export const decideMentorshipRequest = (requestId, decision) => {
  return api.post(
    `mentorship/requests/${requestId}/decision/`,
    { decision }
  )
}

// Cancel a pending mentorship request
export const cancelMentorshipRequest = (requestId) => {
  return api.post(`mentorship/requests/${requestId}/cancel/`)
}

// Get notifications for the logged-in user
export const getNotifications = () => {
  return api.get('mentorship/notifications/')
}

// Mark a notification as read
export const markNotificationRead = (notificationId) => {
  return api.post(`mentorship/notifications/${notificationId}/read/`)
}

// Get a specific mentorship request
export const getMentorshipRequest = (requestId) => {
  return api.get(`mentorship/requests/${requestId}/`)
}