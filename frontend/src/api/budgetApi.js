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
  if (createNew) {
    return new Promise((resolve) => {
      axiosInstance
        .post('/api/monthlybudget', newBudgetEntry)
        .then((response) => {
          if (response.status === 201) {
            resolve(createEntryObject(response.data));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  } else {
    return new Promise((resolve) => {
      axiosInstance
        .put('/api/monthlybudget', newBudgetEntry)
        .then((response) => {
          if (response.status === 200) {
            resolve(createEntryObject(response.data));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}
