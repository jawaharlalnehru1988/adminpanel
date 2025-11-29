import axiosInstance from './axiosInstance';

const ThoughtService = {
  getThoughts: () => axiosInstance.get('/api/thought/'),
  getThought: (id) => axiosInstance.get(`/api/thought/${id}/`),
  createThought: (data) => axiosInstance.post('/api/thought/', data),
  updateThought: (id, data) => axiosInstance.put(`/api/thought/${id}/`, data),
  deleteThought: (id) => axiosInstance.delete(`/api/thought/${id}/`),
};

export default ThoughtService;
