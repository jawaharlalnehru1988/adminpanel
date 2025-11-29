import axiosInstance from './axiosInstance';

const AnnouncementService = {
  getAnnouncements: () => axiosInstance.get('/api/announcements/'),
  getAnnouncement: (id) => axiosInstance.get(`/api/announcements/${id}/`),
  createAnnouncement: (data) => {
    // send JSON body (API shows application/json)
    return axiosInstance.post('/api/announcements/', data);
  },
  updateAnnouncement: (id, data) => {
    return axiosInstance.put(`/api/announcements/${id}/`, data);
  },
  deleteAnnouncement: (id) => axiosInstance.delete(`/api/announcements/${id}/`),
};

export default AnnouncementService;
