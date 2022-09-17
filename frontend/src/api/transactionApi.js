import axiosInstance from './axiosApi';
import { useState } from 'react';

export const submitNewTransaction = (newTransaction) => {
  axiosInstance.post('/api/transaction', newTransaction);
};

export const submitEditTransaction = (editTransaction) => {
  axiosInstance.put(`/api/transaction/${editTransaction.id}`, editTransaction);
};

export function submitNewPayee(newPayee) {
  const [payeeId, setPayeeId] = useState(0);
  axiosInstance.post('/api/payee', newPayee).then((response) => {
    setPayeeId(response.data.id);
  });
  return { payeeId };
}
