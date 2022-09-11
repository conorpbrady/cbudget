import { useState } from 'react';
import axiosInstance from './axiosApi';

export const submitNewGroup = (newGroup) => {
  axiosInstance
    .post('/api/group', { name: newGroup })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const submitNewBucket = (newBucket) => {
  axiosInstance
    .post('/api/bucket', newBucket)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const submitDeleteCategory = (type, id) => {
  const typeURL = type == 'Category' ? 'group' : 'bucket';
  return new Promise((resolve, reject) => {
    axiosInstance
      .delete(`/api/${typeURL}/${id}`)
      .then((response) => {
        resolve('Successfully deleted');
      })
      .catch((error) => {
        reject('Error deleting');
      });
  });
};
