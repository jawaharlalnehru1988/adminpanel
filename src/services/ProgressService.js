import axiosInstance from './axiosInstance';

const ProgressService = {
  getProgresses: () => axiosInstance.get('/api/progress/'),
  getProgress: (id) => axiosInstance.get(`/api/progress/${id}/`),
  createProgress: (data) => axiosInstance.post('/api/progress/', data),
  updateProgress: (id, data) => axiosInstance.patch(`/api/progress/${id}/`, data),
  deleteProgress: (id) => axiosInstance.delete(`/api/progress/${id}/`),
};

export default ProgressService;
