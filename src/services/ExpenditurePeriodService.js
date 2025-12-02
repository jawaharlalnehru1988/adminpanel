import axiosInstance from './axiosInstance';

const ExpenditurePeriodService = {
  getExpenditurePeriods: (params = {}) => axiosInstance.get('/api/expenditure-periods/', { params }),

  createExpenditurePeriod: (data) => {
    console.debug('ExpenditurePeriodService.createExpenditurePeriod JSON:', data);
    return axiosInstance.post('/api/expenditure-periods/', data);
  },

  updateExpenditurePeriod: (id, data) => {
    console.debug('ExpenditurePeriodService.updateExpenditurePeriod JSON:', data);
    return axiosInstance.patch(`/api/expenditure-periods/${id}/`, data);
  },

  deleteExpenditurePeriod: (id) => axiosInstance.delete(`/api/expenditure-periods/${id}/`),
};

export default ExpenditurePeriodService;
