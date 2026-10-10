import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    // এখানে 'access'-এর পরিবর্তে 'access_token' দিতে হবে, কারণ AuthContext এ এটি 'access_token' হিসেবে সেভ করা হয়
    const accessToken = sessionStorage.getItem('access_token') 
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api