import { useState } from 'react';
import axiosInstance from './axiosApi';

export const createEntryObject = (data) => {
  return {
    category: data.category.id,
    month: data.month.id,
    amount: data.amount,
    id: data.id,
  };
};

export function submitBudgetEntry(newBudgetEntry, createNew) {
  const [createdEntry, setCreatedEntry] = useState({});

  if (createNew) {
    axiosInstance
      .post('/api/monthlybudget', newBudgetEntry)
      .then((response) => {
        if (response.status === 201) {
          setCreatedEntry(createEntryObject(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    axiosInstance
      .put('/api/monthlybudget', newBudgetEntry)
      .then((response) => {
        if (response.status === 200) {
          setCreatedEntry(createEntryObject(response.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return { createdEntry };
}
