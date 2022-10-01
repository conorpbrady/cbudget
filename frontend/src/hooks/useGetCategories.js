import { useEffect, useState, useRef } from 'react';
import axiosInstance from '../api/axiosApi';

export const useGetCategories = (fetchToggle) => {
  const [categories, setCategories] = useState([]);
  const [firstCategoryId, setFirstCategoryId] = useState(0);

  useEffect(() => {
    async function handleFetch() {
      await axiosInstance
        .get('/api/category?transaction=true&budget=true')
        .then((response) => {
          setCategories(response.data);
          setFirstCategoryId(response.data[0].id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    handleFetch();
  }, [fetchToggle]);

  return { categories, firstCategoryId };
};
