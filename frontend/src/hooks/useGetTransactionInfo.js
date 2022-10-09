import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosApi';

export const useGetTransactionInfo = (fetchToggle) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payees, setPayees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transferCat, setTransferCat] = useState({});
  useEffect(() => {
    async function handleFetch() {
      await axiosInstance.get('/api/transaction').then((response) => {
        setTransactions(response.data);
        axiosInstance.get('/api/account').then((response) => {
          setAccounts(response.data);
          axiosInstance
            .get('/api/category?transaction=true')
            .then((response) => {
              const parents = response.data;
              let categories = [];
              parents.map((subcategories) => {
                categories = [...categories, ...subcategories.bucket];
              });
              //Remove Transfer Category from array and save to it's own state
              setTransferCat(
                categories.splice(
                  categories.findIndex((item) => item.transfer),
                  1
                )
              );
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

  const updatePayees = (newPayee) => {
    setPayees((prevState) => [...prevState, newPayee]);
  };
  return {
    transactions,
    accounts,
    categories,
    payees,
    transferCat,
    updatePayees,
  };
};
