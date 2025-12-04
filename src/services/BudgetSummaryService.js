import axiosInstance from './axiosInstance';

const BudgetSummaryService = {
  getBudgetSummaries: () => axiosInstance.get('/api/budgets/'),
  createBudgetSummary: (data) => axiosInstance.post('/api/budgets/', data),
  updateBudgetSummary: (id, data) => axiosInstance.put(`/api/budgets/${id}/`, data),
  deleteBudgetSummary: (id) => axiosInstance.delete(`/api/budgets/${id}/`),
};

export default BudgetSummaryService;
