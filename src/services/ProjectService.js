import axiosInstance from './axiosInstance';

const ProjectService = {
  getProjects: () => axiosInstance.get('/api/projects/'),

  createProject: async (data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('cover_image', file);
      console.debug('ProjectService.createProject FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.post('/api/projects/', fd);
    } else {
      console.debug('ProjectService.createProject JSON:', data);
      return axiosInstance.post('/api/projects/', data);
    }
  },

  updateProject: async (id, data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('cover_image', file);
      console.debug('ProjectService.updateProject FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.patch(`/api/projects/${id}/`, fd);
    } else {
      const payload = { ...data, keep_image: true };
      console.debug('ProjectService.updateProject JSON:', payload);
      return axiosInstance.patch(`/api/projects/${id}/`, payload);
    }
  },

  deleteProject: (id) => axiosInstance.delete(`/api/projects/${id}/`),
};

export default ProjectService;
