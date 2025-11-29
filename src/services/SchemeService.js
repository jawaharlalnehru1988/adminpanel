import axiosInstance from './axiosInstance';

const SchemeService = {
  getSchemes: () => axiosInstance.get('/api/schemes/'),

  createScheme: async (data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('icon', file);
      console.debug('SchemeService.createScheme FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.post('/api/schemes/', fd);
    } else {
      console.debug('SchemeService.createScheme JSON:', data);
      return axiosInstance.post('/api/schemes/', data);
    }
  },

  updateScheme: async (id, data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('icon', file);
      console.debug('SchemeService.updateScheme FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.patch(`/api/schemes/${id}/`, fd);
    } else {
      const payload = { ...data, keep_image: true };
      console.debug('SchemeService.updateScheme JSON:', payload);
      return axiosInstance.patch(`/api/schemes/${id}/`, payload);
    }
  },

  deleteScheme: (id) => axiosInstance.delete(`/api/schemes/${id}/`),
};

export default SchemeService;
