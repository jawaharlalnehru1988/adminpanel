import axiosInstance from './axiosInstance';

const BirthdayWishesService = {
  getItems: () => axiosInstance.get('/api/birthday-wishes/'),
  createItem: (data) => axiosInstance.post('/api/birthday-wishes/', data),
  updateItem: (id, data) => axiosInstance.put(`/api/birthday-wishes/${id}/`, data),
  deleteItem: (id) => axiosInstance.delete(`/api/birthday-wishes/${id}/`),
};

export default BirthdayWishesService;
