import axiosInstance from './axiosInstance';

const VillageBooksService = {
  getItems: () => axiosInstance.get('/api/village-books/'),
  createItem: (data) => axiosInstance.post('/api/village-books/', data),
  updateItem: (id, data) => axiosInstance.put(`/api/village-books/${id}/`, data),
  deleteItem: (id) => axiosInstance.delete(`/api/village-books/${id}/`),
};

export default VillageBooksService;
