import axiosInstance from './axiosApi';

export const submitNewAccount = (newAccount) => {
  axiosInstance.post('/api/account', newAccount);
};

export const submitDeleteAccount = (type, accountId) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete(`/api/account/${accountId}`)
      .then((response) => {
        resolve('Successfully deleted');
      })
      .catch((error) => {
        reject('Error deleting object');
      });
  });
};
