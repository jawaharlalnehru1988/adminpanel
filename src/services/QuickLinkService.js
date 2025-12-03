import axiosInstance from "./axiosInstance"

const QuickLinkService = {
  // Stubbed service: replace with real API calls
  getQuickLinks: async () => {
    return axiosInstance.get('/api/quick-links/')
  },
  createQuickLink: async (data) => {
    return axiosInstance.post('/api/quick-links/', data)
  },
  updateQuickLink: async (id, data) => {
    return axiosInstance.put(`/api/quick-links/${id}/`, data)
  },
  deleteQuickLink: async (id) => {
    return axiosInstance.delete(`/api/quick-links/${id}/`)
  }
}

export default QuickLinkService
