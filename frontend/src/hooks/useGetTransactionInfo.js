import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosApi';

export const useGetTransactionInfo = (fetchToggle) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payees, setPayees] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function handleFetch() {
      await axiosInstance.get('/api/transaction').then((response) => {
        setTransactions(response.data);
        axiosInstance.get('/api/account').then((response) => {
          setAccounts(response.data);
          axiosInstance.get('/api/category').then((response) => {
            const parents = response.data;
            let categories = [];
            parents.map((subcategories) => {
              categories = [...categories, ...subcategories.bucket];
            });
            setCategories(categories);

            axiosInstance.get('/api/payee').then((response) => {
              setPayees(response.data);
            });
          });
        });
      });
    }
    handleFetch();
  }, [fetchToggle]);

  return { transactions, accounts, categories, payees };
};
