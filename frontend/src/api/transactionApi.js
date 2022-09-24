import axiosInstance from './axiosApi';
import { useState } from 'react';

export const submitNewTransaction = (newTransaction) => {
  axiosInstance.post('/api/transaction', newTransaction);
};

export const submitEditTransaction = (editTransaction) => {
  axiosInstance.put(`/api/transaction/${editTransaction.id}`, editTransaction);
};

export const submitNewPayee = (newPayee) => {
  const [payeeId, setPayeeId] = useState(0);
  axiosInstance.post('/api/payee', newPayee).then((response) => {
    setPayeeId(response.data.id);
  });
  return { payeeId };
};

export const submitDeleteTransaction = (type, id) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete(`/api/transaction/${id}`)
      .then((response) => {
        resolve('Successfully deleted');
      })
      .catch((error) => {
        reject('Error deleting');
      });
  });
};
