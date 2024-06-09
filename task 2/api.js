import axios from 'axios';

const api = {
  getSpamNumbers: () => {
    return axios.get('/api/spam-numbers');
  },

  markSpam: (phoneNumber) => {
    return axios.post('/api/mark-spam', { phoneNumber });
  },
};

export default api;