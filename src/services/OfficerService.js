import axiosInstance from './axiosInstance';

const OfficerService = {
  getOfficers: () => axiosInstance.get('/api/officers/'),
  getOfficer: (id) => axiosInstance.get(`/api/officers/${id}/`),
  createOfficer: (data, file) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('designation', data.designation || '');
    formData.append('contact', data.contact || '');
    formData.append('tags', data.tags || '');
    formData.append('language', data.language || '');
    formData.append('clientId', data.clientId || '');
    formData.append('whatsapp', data.whatsapp || '');
    formData.append('order', data.order != null ? data.order : '0');

    if (file) {
      formData.append('image', file);
    }

    return axiosInstance.post('/api/officers/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateOfficer: (id, data, file) => {
    // If a file is provided, send multipart/form-data. Otherwise send JSON payload.
    if (file) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('designation', data.designation || '');
      formData.append('contact', data.contact || '');
      formData.append('tags', data.tags || '');
      formData.append('language', data.language || '');
      formData.append('clientId', data.clientId || '');
      formData.append('whatsapp', data.whatsapp || '');
      formData.append('order', data.order != null ? data.order : '0');
      formData.append('image', file);

      if (process.env.NODE_ENV === 'development') {
        for (const pair of formData.entries()) {
          // eslint-disable-next-line no-console
          console.debug('[OfficerService] FormData', pair[0], pair[1]);
        }
      }

      return axiosInstance.patch(`/api/officers/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const payload = {
      name: data.name,
      designation: data.designation || '',
      contact: data.contact || '',
      tags: data.tags || '',
      language: data.language || '',
      clientId: data.clientId || '',
      whatsapp: data.whatsapp || '',
      order: data.order != null ? data.order : 0,
    };

    // include keep_image flag so backend knows to preserve existing image
    payload.keep_image = true;
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[OfficerService] PATCH payload', payload);
    }

    return axiosInstance.patch(`/api/officers/${id}/`, payload);
  },

  deleteOfficer: (id) => axiosInstance.delete(`/api/officers/${id}/`),
};

export default OfficerService;
