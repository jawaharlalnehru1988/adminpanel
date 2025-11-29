import axiosInstance from './axiosInstance';

const ExpenditureCategoryService = {
  getCategories: (params = {}) => axiosInstance.get('/api/expenditure-categories/', { params }),

  createCategory: async (data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('icon', file);
      console.debug('ExpenditureCategoryService.createCategory FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.post('/api/expenditure-categories/', fd);
    } else {
      console.debug('ExpenditureCategoryService.createCategory JSON:', data);
      return axiosInstance.post('/api/expenditure-categories/', data);
    }
  },

  updateCategory: async (id, data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('icon', file);
      console.debug('ExpenditureCategoryService.updateCategory FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.patch(`/api/expenditure-categories/${id}/`, fd);
    } else {
      const payload = { ...data, keep_image: true };
      console.debug('ExpenditureCategoryService.updateCategory JSON:', payload);
      return axiosInstance.patch(`/api/expenditure-categories/${id}/`, payload);
    }
  },

  deleteCategory: (id) => axiosInstance.delete(`/api/expenditure-categories/${id}/`),
};

export default ExpenditureCategoryService;
