import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosApi';

export const useGetAccounts = (fetchToggle) => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    async function handleFetch() {
      await axiosInstance.get('/api/account').then((response) => {
        setAccounts(response.data);
      });
    }
    handleFetch();
  }, [fetchToggle]);

  return { accounts };
};
