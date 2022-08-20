import axiosInstance from './axiosApi';

export const submitNewAccount = (newAccount) => {
  axiosInstance.post('/api/account', newAccount)
};
