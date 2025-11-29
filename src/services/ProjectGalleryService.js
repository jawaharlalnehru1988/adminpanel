import axiosInstance from './axiosInstance';

const ProjectGalleryService = {
  getProjectGallery: () => axiosInstance.get('/api/project-gallery/'),

  createProjectGallery: async (data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('image', file);
      console.debug('ProjectGalleryService.createProjectGallery FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.post('/api/project-gallery/', fd);
    } else {
      console.debug('ProjectGalleryService.createProjectGallery JSON:', data);
      return axiosInstance.post('/api/project-gallery/', data);
    }
  },

  updateProjectGallery: async (id, data, file) => {
    if (file) {
      const fd = new FormData();
      Object.keys(data).forEach((k) => fd.append(k, data[k]));
      fd.append('image', file);
      console.debug('ProjectGalleryService.updateProjectGallery FormData:', Array.from(fd.entries()).map(([k, v]) => [k, v.name || typeof v]));
      return axiosInstance.patch(`/api/project-gallery/${id}/`, fd);
    } else {
      const payload = { ...data, keep_image: true };
      console.debug('ProjectGalleryService.updateProjectGallery JSON:', payload);
      return axiosInstance.patch(`/api/project-gallery/${id}/`, payload);
    }
  },

  deleteProjectGallery: (id) => axiosInstance.delete(`/api/project-gallery/${id}/`),
};

export default ProjectGalleryService;
