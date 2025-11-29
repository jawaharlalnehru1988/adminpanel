import axiosInstance from './axiosInstance';

const FigureService = {
  getFigures: () => axiosInstance.get('/api/figures/'),
  getFigure: (id) => axiosInstance.get(`/api/figures/${id}/`),
  createFigure: (data) => axiosInstance.post('/api/figures/', data),
  updateFigure: (id, data) => axiosInstance.put(`/api/figures/${id}/`, data),
  deleteFigure: (id) => axiosInstance.delete(`/api/figures/${id}/`),
};

export default FigureService;
