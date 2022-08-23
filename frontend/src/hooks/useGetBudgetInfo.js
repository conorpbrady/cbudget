import { useState, useEffect, useRef, useMemo } from 'react';
import { transformBudgetData, sumBudgetData } from '../utils/budgetUtils';
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

export const useGetBudgetSum = (budget, months, categories) => {
  const [budgetSum, setBudgetSum] = useState({});

  useEffect(() => {
    setBudgetSum(sumBudgetData(budget, categories));
  }, [months, budget]);
  return { budgetSum };
};
