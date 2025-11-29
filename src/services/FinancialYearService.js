import axiosInstance from './axiosInstance';

const FinancialYearService = {
  getFinancialYears: () => axiosInstance.get('/api/financial-years/'),
};

export default FinancialYearService;
