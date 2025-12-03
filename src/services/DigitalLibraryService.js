import axiosInstance from './axiosInstance';

const DigitalLibraryService = {
  getItems: () => axiosInstance.get('/api/digital-library/'),
  createItem: (data) => axiosInstance.post('/api/digital-library/', data),
  updateItem: (id, data) => axiosInstance.patch(`/api/digital-library/${id}/`, data),
  deleteItem: (id) => axiosInstance.delete(`/api/digital-library/${id}/`),
};

export default DigitalLibraryService;
