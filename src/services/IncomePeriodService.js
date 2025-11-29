import axiosInstance from './axiosInstance';

const IncomePeriodService = {
  getIncomePeriods: (params = {}) => axiosInstance.get('/api/income-periods/', { params }),

  createIncomePeriod: (data) => {
    console.debug('IncomePeriodService.createIncomePeriod JSON:', data);
    return axiosInstance.post('/api/income-periods/', data);
  },

  updateIncomePeriod: (id, data) => {
    console.debug('IncomePeriodService.updateIncomePeriod JSON:', data);
    return axiosInstance.patch(`/api/income-periods/${id}/`, data);
  },

  deleteIncomePeriod: (id) => axiosInstance.delete(`/api/income-periods/${id}/`),
};

export default IncomePeriodService;
