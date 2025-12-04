import axiosInstance from './axiosInstance';

const FinancialReportsService = {
  getItems: () => axiosInstance.get('/api/financial-reports/'),
  createItem: (data) => axiosInstance.post('/api/financial-reports/', data),
  updateItem: (id, data) => axiosInstance.put(`/api/financial-reports/${id}/`, data),
  deleteItem: (id) => axiosInstance.delete(`/api/financial-reports/${id}/`),
};

export default FinancialReportsService;
