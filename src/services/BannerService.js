import axiosInstance from './axiosInstance';

const BannerService = {
  // Get all banners
  getBanners: () => {
    return axiosInstance.get('/api/banner/');
  },

  // Get banner by ID
  getBannerById: (id) => {
    return axiosInstance.get(`/api/banner/${id}/`);
  },

  // Create new banner with file
  createBanner: (data, file) => {
    const formData = new FormData();
    
    // Add all fields to formData
    formData.append('title', data.title);
    formData.append('subtitle', data.subtitle);
    formData.append('language', data.language);
    formData.append('is_active', data.is_active ? true : false);
    
    // Add file if provided
    if (file) {
      formData.append('background_image', file);
    }

    if (process.env.NODE_ENV === 'development') {
      for (const pair of formData.entries()) {
        // eslint-disable-next-line no-console
        console.debug('[BannerService] FormData', pair[0], pair[1]);
      }
    }

    return axiosInstance.post('/api/banner/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update banner with file
  updateBanner: (id, data, file) => {
    // If a file is provided, send multipart/form-data. Otherwise send JSON.
    if (file) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle);
      formData.append('language', data.language);
      formData.append('is_active', data.is_active ? true : false);
      formData.append('background_image', file);

      if (process.env.NODE_ENV === 'development') {
        for (const pair of formData.entries()) {
          // eslint-disable-next-line no-console
          console.debug('[BannerService] FormData', pair[0], pair[1]);
        }
      }

      return axiosInstance.patch(`/api/banner/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    const payload = {
      title: data.title,
      subtitle: data.subtitle,
      language: data.language,
      is_active: data.is_active ? true : false,
      keep_image: true,
    };

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[BannerService] PATCH payload', payload);
    }

    return axiosInstance.patch(`/api/banner/${id}/`, payload);
  },

  // Delete banner
  deleteBanner: (id) => {
    return axiosInstance.delete(`/api/banner/${id}/`);
  },
};

export default BannerService;
