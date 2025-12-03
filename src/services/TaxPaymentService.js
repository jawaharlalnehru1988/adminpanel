import axiosInstance from './axiosInstance';

const TaxPaymentService = {
  getItems: () => axiosInstance.get('/api/tax-payments/'),
  createItem: (data) => axiosInstance.post('/api/tax-payments/', data),
  updateItem: (id, data) => axiosInstance.patch(`/api/tax-payments/${id}/`, data),
  deleteItem: (id) => axiosInstance.delete(`/api/tax-payments/${id}/`),
};

export default TaxPaymentService;
