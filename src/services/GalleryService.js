import axiosInstance from './axiosInstance';

const GalleryService = {
  getGalleries: () => axiosInstance.get('/api/gallery/'),
  getGallery: (id) => axiosInstance.get(`/api/gallery/${id}/`),
  createGallery: (data, file) => {
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('language', data.language || '');

    if (file) {
      formData.append('image', file);
    }

    return axiosInstance.post('/api/gallery/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateGallery: (id, data, file) => {
    if (file) {
      const formData = new FormData();
      formData.append('title', data.title || '');
      formData.append('language', data.language || '');
      formData.append('image', file);

      if (process.env.NODE_ENV === 'development') {
        for (const pair of formData.entries()) {
          // eslint-disable-next-line no-console
          console.debug('[GalleryService] FormData', pair[0], pair[1]);
        }
      }

      return axiosInstance.patch(`/api/gallery/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const payload = {
      title: data.title || '',
      language: data.language || '',
      keep_image: true,
    };

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[GalleryService] PATCH payload', payload);
    }

    return axiosInstance.patch(`/api/gallery/${id}/`, payload);
  },

  deleteGallery: (id) => axiosInstance.delete(`/api/gallery/${id}/`),
};

export default GalleryService;
