import { useState, useEffect, useMemo } from 'react';
import {
  transformMonthData,
  getMonthsInWindow,
  transformBudgetData,
  transformSumData,
} from '../utils/budgetUtils';
import axiosInstance from '../api/axiosApi';

export const useGetCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function handleFetch() {
      await axiosInstance.get('/api/category?budget=true').then((response) => {
        setCategories(response.data);
      });
    }
    handleFetch();
  }, []);
  return { categories };
};

export const useGetMonths = (currentMonth, range, toggle) => {
  const [windowMonths, setWindowMonths] = useState([]);
  let months = {};
  useEffect(() => {
    async function handleFetch() {
      await axiosInstance
        .get(`/api/months?center=${currentMonth}`)
        .then((response) => {
          months = transformMonthData(response.data);
          setWindowMonths(getMonthsInWindow(months, currentMonth, range));
        })
        .catch((error) => {
          console.log(error);
        });
    }
    handleFetch();
  }, []);

  return { windowMonths };
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
      await axiosInstance.get(monthUrl).then((response) => {
        setBudget(transformBudgetData(response.data));
      });
    }
    handleFetch();
  }, []);

  return { budget, setBudget };
};

export const useGetSumData = (fetchToggle) => {
  const [sumData, setSumData] = useState({});

  useEffect(() => {
    axiosInstance.get('/api/sums').then((response) => {
      setSumData(transformSumData(response.data));
    });
  }, [fetchToggle]);
  return { sumData };
};
