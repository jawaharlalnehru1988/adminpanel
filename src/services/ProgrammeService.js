import axiosInstance from './axiosInstance';

const ProgrammeService = {
  getProgrammes: () => axiosInstance.get('/api/programme-highlights/'),
  getProgramme: (id) => axiosInstance.get(`/api/programme-highlights/${id}/`),
  createProgramme: (data) => axiosInstance.post('/api/programme-highlights/', data),
  updateProgramme: (id, data) => axiosInstance.put(`/api/programme-highlights/${id}/`, data),
  deleteProgramme: (id) => axiosInstance.delete(`/api/programme-highlights/${id}/`),
};

export default ProgrammeService;
