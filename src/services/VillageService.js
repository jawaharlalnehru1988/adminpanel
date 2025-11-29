import axiosInstance from './axiosInstance';

const VillageService = {
  getVillageInfos: () => axiosInstance.get('/api/village-info/'),
  getVillageInfo: (id) => axiosInstance.get(`/api/village-info/${id}/`),
  createVillageInfo: (data, file) => {
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('description', data.description || '');
    formData.append('order', data.order != null ? data.order : '0');
    formData.append('tags', data.tags || '');
    if (data.language) formData.append('language', data.language);
    if (data.clientId) formData.append('clientId', data.clientId);

    if (file) {
      formData.append('image', file);
    }

    if (process.env.NODE_ENV === 'development') {
      for (const pair of formData.entries()) {
        // eslint-disable-next-line no-console
        console.debug('[VillageService] FormData', pair[0], pair[1]);
      }
    }

    return axiosInstance.post('/api/village-info/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateVillageInfo: (id, data, file) => {
    // Send multipart when file provided, otherwise send JSON payload
    if (file) {
      const formData = new FormData();
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('order', data.order != null ? data.order : '0');
      formData.append('tags', data.tags || '');
      if (data.language) formData.append('language', data.language);
      if (data.clientId) formData.append('clientId', data.clientId);
      formData.append('image', file);

      if (process.env.NODE_ENV === 'development') {
        for (const pair of formData.entries()) {
          // eslint-disable-next-line no-console
          console.debug('[VillageService] FormData', pair[0], pair[1]);
        }
      }

      return axiosInstance.patch(`/api/village-info/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const payload = {
      title: data.title || '',
      description: data.description || '',
      order: data.order != null ? data.order : 0,
      tags: data.tags || '',
    };
    if (data.language) payload.language = data.language;
    if (data.clientId) payload.clientId = data.clientId;

    // include keep_image flag so backend knows to preserve existing image
    payload.keep_image = true;
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[VillageService] PATCH payload', payload);
    }

    return axiosInstance.patch(`/api/village-info/${id}/`, payload);
  },

  deleteVillageInfo: (id) => axiosInstance.delete(`/api/village-info/${id}/`),
};

export default VillageService;
