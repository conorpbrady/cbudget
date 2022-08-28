import { useState, useEffect, useRef, useMemo } from 'react';
import {
  transformBudgetData,
  transformSumData,
  transformTransactionSumData,
} from '../utils/budgetUtils';
import axiosInstance from '../api/axiosApi';

export const useGetCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function handleFetch() {
      await axiosInstance.get('/api/category').then((response) => {
        setCategories(response.data);
      });
    }
    handleFetch();
  }, []);
  return { categories };
};

export const useGetMonths = () => {
  const [months, setMonths] = useState([
    { id: 1, key: '0822' },
    { id: 2, key: '0922' },
    { id: 3, key: '1022' },
  ]);
  useEffect(() => {}, []);
  return { months };
};
export const useGetBudget = (months) => {
  // Memoize this value so useEffect is not called every rerender
  const monthString = useMemo(
    () => months.map((obj) => obj.id).join(','),
    [months]
  );
  const monthUrl = `/api/monthlybudget?months=${monthString}`;

  const [budget, setBudget] = useState([]);

  useEffect(() => {
    async function handleFetch() {
      //await axiosInstance.get('/api/month')
      //.then(response => {
      //  const monthString = response.data.map(obj => obj.id).join(',');
      //  const monthUrl = `/api/monthlybudget?months=${monthUrl}`;
      await axiosInstance.get(monthUrl).then((response) => {
        setBudget(transformBudgetData(response.data));
      });
    }
    handleFetch();
  }, [monthString]);

  return { budget, setBudget };
};

export const useGetBudgetSum = (months, fetchToggle) => {
  const [budgetSum, setBudgetSum] = useState({});
  const monthString = useMemo(
    () => months.map((obj) => obj.id).join(','),
    [months]
  );

  useEffect(() => {
    axiosInstance
      .get(`/api/monthlysum?months=${monthString}`)
      .then((response) => {
        setBudgetSum(transformSumData(response.data));
      });
  }, [monthString, fetchToggle]);
  return { budgetSum };
};

export const useGetTransactionSum = (months) => {
  const [transactionSum, setTransactionSum] = useState({});
  const monthString = useMemo(
    () => months.map((obj) => obj.id).join(','),
    [months]
  );

  useEffect(() => {
    axiosInstance
      .get(`/api/transactionsum?months=${monthString}`)
      .then((response) => {
        setTransactionSum(transformTransactionSumData(response.data));
      });
  }, [monthString]);
  return { transactionSum };
};
