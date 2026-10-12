import api from '../api/axios'


export const createMentorshipRequest = (data) => {
  return api.post('mentorship/requests/', data)
}


export const getSentRequests = () => {
  return api.get('mentorship/requests/sent/')
}


export const getReceivedRequests = () => {
  return api.get('mentorship/requests/received/')
}


export const decideMentorshipRequest = (requestId, decision) => {
  return api.post(
    `mentorship/requests/${requestId}/decision/`,
    { decision }
  )
}


export const cancelMentorshipRequest = (requestId) => {
  return api.post(`mentorship/requests/${requestId}/cancel/`)
}


export const getNotifications = () => {
  return api.get('mentorship/notifications/')
}


export const markNotificationRead = (notificationId) => {
  return api.post(`mentorship/notifications/${notificationId}/read/`)
}


export const getMentorshipRequest = (requestId) => {
  return api.get(`mentorship/requests/${requestId}/`)
}