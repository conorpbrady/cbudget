import { useState, useEffect, useMemo } from 'react';
import {
  transformMonthData,
  getMonthId,
  transformBudgetData,
  transformSumData,
  createMonthString,
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

export const useGetBudgetData = (monthShortName, range) => {
  const [budgetData, setBudgetData] = useState([]);
  const [sumData, setSumData] = useState([]);
  const [monthId, setMonthId] = useState(0);
  const [allMonths, setAllMonths] = useState([]);
  const [monthDataLoaded, setMonthDataLoaded] = useState(false);
  const [windowMonths, setWindowMonths] = useState([]);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [fetchToggle, setFetchToggle] = useState(false);
  const [maxFetchedMonth, setMaxFetchedMonth] = useState(0);

  const getMonthObjects = (months, monthId, range) => {
    let output = [];
    for (let i = 0; i < range; i++) {
      const monthObject = months[monthId + i - 1];
      if (monthObject !== undefined) {
        output.push(monthObject);
      }
    }
    return output;
  };

  const monthString = useMemo(
    () => createMonthString(monthId, range),
    [monthId]
  );

  const monthUrl = `/api/monthlybudget?months=${monthString}`;

  useEffect(() => {
    const handleMonthFetch = async (monthShortName) => {
      await axiosInstance
        .get(`/api/months?center=${monthShortName}`)
        .then((response) => {
          const months = response.data;
          setAllMonths(months);
          setMaxFetchedMonth(Math.max(...Object.keys(months)));
          getMonthId(months, monthShortName)
            .then((monthId) => {
              setMonthId(monthId);
              setWindowMonths(getMonthObjects(months, monthId, range));
            })
            .catch((error) => console.log(error));
          setMonthDataLoaded(true);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    handleMonthFetch(monthShortName);
  }, []);

  useEffect(() => {
    const handleBudgetFetch = async () => {
      await axiosInstance
        .get(monthUrl)
        .then((response) => {
          setBudgetData(transformBudgetData(response.data));
        })
        .catch((error) => console.log(error));
    };

    const handleSumFetch = async (maxMonth) => {
      await axiosInstance
        .get('/api/sums')
        .then((response) => {
          setSumData(transformSumData(response.data));
        })
        .catch((error) => console.log(error));
    };

    if (monthDataLoaded) {
      handleBudgetFetch();
      handleSumFetch(10);
      setLoadingFinished(true);
    }
  }, [monthDataLoaded, monthString, fetchToggle]);

  useEffect(() => {
    const wMonths = getMonthObjects(allMonths, monthId, range);
    if (wMonths.length < range) {
      return;
    }
    setWindowMonths(wMonths);
  }, [monthId]);

  return {
    monthId,
    budgetData,
    sumData,
    setMonthId,
    setBudgetData,
    windowMonths,
    maxFetchedMonth,
    loadingFinished,
    fetchToggle,
    setFetchToggle,
  };
};
/*
export const useGetMonthId = (months, monthShortName) => {
  const [rootMonthId, setRootMonthId] = useState(0);
  useEffect(() => {
    getMonthId(months, monthShortName).then((monthId) =>
      setRootMonthId(monthId)
    );
  }, [months, monthShortName]);
  return { rootMonthId, setRootMonthId };
};

export const useGetBudget = (rootMonth, range) => {
  const [budget, setBudget] = useState([]);

  // Memoize this value so useEffect is not called every rerender
  // Creates a string from a starting value and adds n consecutive
  // values e.g. (3, 3) returns "3,4,5"
  const monthString = useMemo(
    () =>
      Array(range)
        .fill(rootMonth)
        .map((v, i) => v + i)
        .join(','),
    [rootMonth]
  );
  const monthUrl = `/api/monthlybudget?months=${monthString}`;

  useEffect(() => {
    async function handleFetch() {
      await axiosInstance.get(monthUrl).then((response) => {
        setBudget(transformBudgetData(response.data));
      });
    }
    handleFetch();
  }, [monthString]);

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
*/
