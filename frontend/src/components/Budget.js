import React, { useState, useCallback } from 'react';
import './Budget.css';
import { splitMonthCatId } from '../utils/utils';
import { submitBudgetEntry, changeBudgetEntry } from '../api/budgetApi';
import {
  useGetMonths,
  useGetCategories,
  useGetBudget,
  useGetSumData,
} from '../hooks/useGetBudgetInfo';
import { Table, Button, Alert } from 'react-bootstrap';

export default function Budget() {
  const { categories } = useGetCategories();
  const { months } = useGetMonths();
  const { budget, setBudget } = useGetBudget(months);

  const [fetchSumToggle, setFetchSumToggle] = useState(true);

  //const { budgetSum } = useGetBudgetSum(months, fetchSumToggle);
  const { sumData } = useGetSumData(fetchSumToggle);

  const handleChange = (event) => {
    const month = event.target.dataset.month;
    const category = event.target.dataset.category;
    if (budget[category] === undefined) {
      setBudget((prevState) => ({
        ...prevState,
        [category]: {
          [month]: {},
        },
      }));
    }

    setBudget((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [month]: {
          ...prevState[category][month],
          amount: event.target.value,
        },
      },
    }));
  };

  const handleBlur = (event) => {
    const amount = parseInt(event.target.value);
    const month = event.target.dataset.month;
    const category = event.target.dataset.category;
    const parentId = event.target.dataset.parentid;

    const existingAmount = budget?.[category]?.[month]?.initAmount || 0;

    if (amount === existingAmount) {
      return;
    }

    const newBudgetEntry = {
      month: month,
      category: category,
      amount: amount,
    };
    const entryId = event.target.dataset.entry;
    submitBudgetEntry(newBudgetEntry, entryId).then((createdEntry) => {
      setBudget((prevState) => ({
        ...prevState,
        [createdEntry.category]: {
          ...prevState[category],
          [createdEntry.month]: {
            amount: createdEntry.amount,
            id: createdEntry.id,
            initAmount: createdEntry.amount,
          },
          parentId: parentId,
        },
      }));
    });
    setFetchSumToggle((prevState) => !prevState);
  };

  const reduceSumData = (sumObj, keyToFilter) => {
    let output = {};
    if (sumObj === undefined) return output;
    Object.keys(sumObj).map((monthKey) => {
      output = {
        ...output,
        [monthKey]: sumObj[monthKey][keyToFilter],
      };
    });
    return output;
  };

  return (
    <div className="budget-container">
      <Table size="sm" className="budget-table">
        <thead>
          <tr>
            <th>Categories</th>
            {months.map((month, index) => {
              return (
                <th key={index} colSpan="3">
                  {month.key}
                </th>
              );
            })}
          </tr>
          <MonthlySummaryLine
            months={months}
            message="Income: "
            values={reduceSumData(sumData.months, 'income')}
          />
          <MonthlySummaryLine
            months={months}
            message="Budgeted: "
            values={reduceSumData(sumData.months, 'budgetAmount')}
          />
          <MonthlySummaryLine
            months={months}
            message="Difference: "
            values={reduceSumData(sumData.months, 'leftToBudget')}
            firstCell="Categories"
          />
          <tr></tr>
        </thead>

        <tbody>
          {categories.map((category) => {
            const categorySumData = sumData[category.id] || {};
            return (
              <React.Fragment key={category.id.toString()}>
                <tr className="heading-row">
                  <td className="budget-cat cat-heading">{category.name}</td>
                  <HeadingLines
                    months={months}
                    categorySumData={categorySumData}
                  />
                </tr>

                <BudgetLines
                  months={months}
                  budget={budget}
                  subcategories={category.bucket}
                  categorySumData={categorySumData}
                  parentId={category.id}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

function MonthlySummaryLine(props) {
  return (
    <tr>
      <td className="budget-cat">{props.firstCell}</td>
      {props.months.map((month) => {
        const value = parseInt(props.values?.[month.id]) || 0;
        return (
          <React.Fragment key={month.id}>
            <td className="monthly-summary" colSpan="2">
              {props.message}
            </td>
            <td className="monthly-summary">{value.toFixed(2)}</td>
          </React.Fragment>
        );
      })}
    </tr>
  );
}

function HeadingLines(props) {
  const months = props.months || [];
  const headingLines = months.map((month, index) => {
    const entrySum = props.categorySumData.months?.[month.id]?.budgetTotal || 0;
    const transactionSum =
      props.categorySumData.months?.[month.id]?.transactionTotal || 0;
    const diff = parseInt(entrySum) + parseInt(transactionSum);
    return (
      <React.Fragment key={index}>
        <td className="budget-entry cat-heading">{entrySum.toFixed(2)}</td>
        <td className="budget-calc cat-heading">{transactionSum.toFixed(2)}</td>
        <td className="budget-diff cat-heading">{diff.toFixed(2)}</td>
      </React.Fragment>
    );
  });
  return headingLines;
}

function BudgetLines(props) {
  const sub = props.subcategories || [];
  const months = props.months || [];
  const budgetLines = sub.map((subcategory) => {
    return (
      <tr key={subcategory.id.toString()}>
        <td className="budget-cat"> {subcategory.name}</td>
        <MonthLines
          budget={props.budget[subcategory.id]}
          months={months}
          parentId={props.parentId}
          subcategoryId={subcategory.id}
          subcategorySumData={
            props.categorySumData.subcategories?.[subcategory.id]
          }
          handleChange={props.handleChange}
          handleBlur={props.handleBlur}
        />
      </tr>
    );
  });
  return budgetLines;
}

function MonthLines(props) {
  const monthLines = props.months.map((month, index) => {
    const budgetData = props.subcategorySumData?.[month.id] || {};
    const entryAmount = parseInt(props.budget?.[month.id]?.amount) || 0;
    const calc = parseInt(budgetData.transactionAmount) || 0;
    const diff =
      parseInt(budgetData.budgetSum || 0) +
      parseInt(budgetData.transactionSum || 0);
    const entryId = props.budget?.[month.id]?.id || 0;
    return (
      <React.Fragment key={index}>
        <td className="budget-entry">
          <input
            type="number"
            value={entryAmount}
            data-parentid={props.parentId}
            data-entry={entryId}
            data-month={month.id}
            data-category={props.subcategoryId}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
          />
        </td>
        <td className="budget-calc">{calc.toFixed(2)}</td>
        <td className="budget-diff">{diff.toFixed(2)}</td>
      </React.Fragment>
    );
  });

  return monthLines;
}
