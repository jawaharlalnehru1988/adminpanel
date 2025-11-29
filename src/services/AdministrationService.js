import axiosInstance from './axiosInstance';

const AdministrationService = {
  getAdministrations: () => axiosInstance.get('/api/administration/'),
  getAdministration: (id) => axiosInstance.get(`/api/administration/${id}/`),
  createAdministration: (data, file) => {
    const formData = new FormData();
    formData.append('name', data.name || '');
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

    return axiosInstance.post('/api/administration/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateAdministration: (id, data, file) => {
    // If a file is provided, send multipart/form-data. Otherwise send JSON payload.
    if (file) {
      const formData = new FormData();
      formData.append('name', data.name || '');
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
          console.debug('[AdministrationService] FormData', pair[0], pair[1]);
        }
      }

      return axiosInstance.patch(`/api/administration/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    const payload = {
      name: data.name || '',
      designation: data.designation || '',
      contact: data.contact || '',
      tags: data.tags || '',
      language: data.language || '',
      clientId: data.clientId || '',
      whatsapp: data.whatsapp || '',
      order: data.order != null ? data.order : 0,
      keep_image: true,
    };

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[AdministrationService] PATCH payload', payload);
    }

    return axiosInstance.patch(`/api/administration/${id}/`, payload);
  },

  deleteAdministration: (id) => axiosInstance.delete(`/api/administration/${id}/`),
};

export default AdministrationService;
