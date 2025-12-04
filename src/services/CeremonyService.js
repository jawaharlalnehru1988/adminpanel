import axiosInstance from './axiosInstance';

const CeremonyService = {
  getItems: () => axiosInstance.get('/api/ceremonies/'),
  createItem: (data) => axiosInstance.post('/api/ceremonies/', data),
  updateItem: (id, data) => axiosInstance.put(`/api/ceremonies/${id}/`, data),
  deleteItem: (id) => axiosInstance.delete(`/api/ceremonies/${id}/`),
};

export default CeremonyService;
