import axiosInstance from './axiosInstance';

const ComplaintService = {
  getComplaints: () => axiosInstance.get('/api/complaints/'),
  getComplaint: (id) => axiosInstance.get(`/api/complaints/${id}/`),
  createComplaint: (data) => {
    console.debug('ComplaintService.createComplaint JSON:', data);
    return axiosInstance.post('/api/complaints/', data);
  },
  updateComplaint: (id, data) => {
    console.debug('ComplaintService.updateComplaint JSON:', data);
    return axiosInstance.patch(`/api/complaints/${id}/`, data);
  },
  deleteComplaint: (id) => axiosInstance.delete(`/api/complaints/${id}/`),
};

export default ComplaintService;
