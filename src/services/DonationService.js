import axiosInstance from './axiosInstance';

const DonationService = {
  getDonations: () => axiosInstance.get('/api/donations/'),
  getDonation: (id) => axiosInstance.get(`/api/donations/${id}/`),
  createDonation: (data) => {
    console.debug('DonationService.createDonation JSON:', data);
    return axiosInstance.post('/api/donations/', data);
  },
  updateDonation: (id, data) => {
    console.debug('DonationService.updateDonation JSON:', data);
    return axiosInstance.patch(`/api/donations/${id}/`, data);
  },
  deleteDonation: (id) => axiosInstance.delete(`/api/donations/${id}/`),
};

export default DonationService;
