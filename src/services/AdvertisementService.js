import axiosInstance from './axiosInstance';

const AdvertisementService = {
  getAdvertisements: () => axiosInstance.get('/api/advertisements/'),
  getAdvertisement: (id) => axiosInstance.get(`/api/advertisements/${id}/`),
  createAdvertisement: (data, file) => {
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('link', data.link || '');
    formData.append('language', data.language || '');

    if (file) {
      formData.append('image', file);
    }

    return axiosInstance.post('/api/advertisements/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateAdvertisement: (id, data, file) => {
    if (file) {
      const formData = new FormData();
      formData.append('title', data.title || '');
      formData.append('link', data.link || '');
      formData.append('language', data.language || '');
      formData.append('image', file);

      if (process.env.NODE_ENV === 'development') {
        for (const pair of formData.entries()) {
          // eslint-disable-next-line no-console
          console.debug('[AdvertisementService] FormData', pair[0], pair[1]);
        }
      }

      return axiosInstance.patch(`/api/advertisements/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const payload = {
      title: data.title || '',
      link: data.link || '',
      language: data.language || '',
      keep_image: true,
    };

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[AdvertisementService] PATCH payload', payload);
    }

    return axiosInstance.patch(`/api/advertisements/${id}/`, payload);
  },

  deleteAdvertisement: (id) => axiosInstance.delete(`/api/advertisements/${id}/`),
};

export default AdvertisementService;
