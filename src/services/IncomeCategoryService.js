import axiosInstance from './axiosInstance';

const IncomeCategoryService = {
  getCategories: (params = {}) => axiosInstance.get('/api/income-categories/', { params }),

  createCategory: async (data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('icon', file);
      console.debug('IncomeCategoryService.createCategory FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.post('/api/income-categories/', fd);
    } else {
      console.debug('IncomeCategoryService.createCategory JSON:', data);
      return axiosInstance.post('/api/income-categories/', data);
    }
  },

  updateCategory: async (id, data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('icon', file);
      console.debug('IncomeCategoryService.updateCategory FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.patch(`/api/income-categories/${id}/`, fd);
    } else {
      const payload = { ...data, keep_image: true };
      console.debug('IncomeCategoryService.updateCategory JSON:', payload);
      return axiosInstance.patch(`/api/income-categories/${id}/`, payload);
    }
  },

  deleteCategory: (id) => axiosInstance.delete(`/api/income-categories/${id}/`),
};

export default IncomeCategoryService;
