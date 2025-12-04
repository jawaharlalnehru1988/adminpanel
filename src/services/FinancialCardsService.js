import axiosInstance from './axiosInstance';

const FinancialCardsService = {
  getItems: () => axiosInstance.get('/api/financial-cards/'),
  createItem: (data) => axiosInstance.post('/api/financial-cards/', data),
  updateItem: (id, data) => axiosInstance.put(`/api/financial-cards/${id}/`, data),
  deleteItem: (id) => axiosInstance.delete(`/api/financial-cards/${id}/`),
};

export default FinancialCardsService;
