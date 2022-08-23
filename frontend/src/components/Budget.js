import React, { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosApi';
import './Budget.css';
import { splitMonthCatId } from '../utils/utils';
import { submitBudgetEntry, changeBudgetEntry } from '../api/budgetApi';
import {
  useGetMonths,
  useGetCategories,
  useGetBudget,
  useGetBudgetSum,
} from '../hooks/useGetBudgetInfo';

export default function Budget() {
  const { categories } = useGetCategories();
  const { months } = useGetMonths();
  const { budget, setBudget } = useGetBudget(months);
  const { budgetSum } = useGetBudgetSum(budget, months, categories);

  const handleChange = (event) => {
    const month = event.target.dataset.month;
    const category = event.target.dataset.category;
    if (budget[category] === undefined) {
      setBudget((prevState) => ({
        budget: {
          ...prevState.budget,
          [category]: {
            [month]: {},
          },
        },
      }));
    }
    setBudget((prevState) => ({
      budget: {
        ...prevState.budget,
        [category]: {
          ...prevState.budget[category],
          [month]: {
            ...prevState.budget[category][month],
            amount: event.target.value,
          },
        },
      },
    }));
  };

  const updateBudgetWithNewEntry = (
    category,
    month,
    amount,
    entryId,
    parentId,
    existingAmount
  ) => {
    this.setState((prevState) => {
      let prevCategory = {};
      if (prevState.budget.hasOwnProperty(category)) {
        prevCategory = prevState.budget[category];
      }
      return {
        budget: {
          ...prevState.budget,
          [category]: {
            ...prevCategory,
            [month]: {
              id: entryId,
              amount: amount,
              initAmount: amount,
            },
          },
        },
      };
    });

    this.setState((prevState) => {
      const prevValue = prevState.budgetSum[parentId][month] || 0;
      const prevSum = parseInt(prevValue);
      const deltaSum = parseInt(amount) - parseInt(existingAmount);
      const newSum = prevSum + deltaSum;
      return {
        budgetSum: {
          ...prevState.budgetSum,
          [parentId]: {
            ...prevState.budgetSum[parentId],
            [month]: newSum,
          },
        },
      };
    });
  };
  // TODO: This is in desperate need of a refactor
  // Try to come up with a way to avoid nested state for budget
  // PUT and POST methods can re-use the same code to update state
  //
  const handleBlur = (event) => {
    const amount = parseInt(event.target.value);
    const month = event.target.dataset.month;
    const category = event.target.dataset.category;
    const parentId = event.target.dataset.parentid;
    const budget = this.state.budget;

    let existingAmount = 0;
    if (
      budget.hasOwnProperty(category) &&
      budget[category].hasOwnProperty(month)
    ) {
      existingAmount = parseInt(this.state.budget[category][month].initAmount);
    }

    existingAmount = existingAmount || 0;

    if (amount === 0 || amount === existingAmount) {
      return;
    }

    const newBudgetEntry = {
      month: month,
      category: category,
      amount: amount,
    };
    const entryId = event.target.dataset.entry;
    const submitAsNew = entryId === 0 || entryId === undefined;
    const { createdEntry } = submitNewTransaction(newBudgetEntry, submitAsNew);
  };

  const monthIncome = 0;
  const monthSpend = 0;
  const monthDiff = monthIncome - monthSpend;
  return (
    <div className="budget-container">
      <table className="budget-table">
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
            value={monthIncome}
          />
          <MonthlySummaryLine
            months={months}
            message="Spent: "
            value={monthSpend}
          />
          <MonthlySummaryLine
            months={months}
            message="Difference: "
            value={monthDiff}
            firstCell="Categories"
          />
          <tr></tr>
        </thead>

        <tbody>
          {categories.map((category) => {
            const categorySum = budgetSum[category.id] || {};
            return (
              <React.Fragment key={category.id.toString()}>
                <tr className="heading-row">
                  <td className="budget-cat cat-heading">{category.name}</td>
                  <HeadingLines months={months} budgetSum={categorySum} />
                </tr>

                <BudgetLines
                  months={months}
                  budget={budget}
                  subcategories={category.bucket}
                  parentId={category.id}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MonthlySummaryLine(props) {
  return (
    <tr>
      <td className="budget-cat">{props.firstCell}</td>
      {props.months.map((month) => {
        return (
          <td className="monthly-summary" key={month.id} colSpan="3">
            {props.message}
          </td>
        );
      })}
    </tr>
  );
}

function HeadingLines(props) {
  const months = props.months || [];
  const headingLines = months.map((month, index) => {
    let entrySum = '0.00';
    if (props.budgetSum.hasOwnProperty(month.id)) {
      entrySum = props.budgetSum[month.id];
    }
    return (
      <React.Fragment key={index}>
        <td className="budget-entry cat-heading">{entrySum}</td>
        <td className="budget-calc cat-heading">0.00</td>
        <td className="budget-diff cat-heading">0.00</td>
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
          handleChange={props.handleChange}
          handleBlur={props.handleBlur}
        />
      </tr>
    );
  });
  return budgetLines;
}

function MonthLines(props) {
  const budgetData = props.budget || {};
  const monthLines = props.months.map((month, index) => {
    let entryId = 0;
    let entryAmount = 0;
    if (budgetData.hasOwnProperty(month.id)) {
      entryId = budgetData[month.id].id;
      entryAmount = budgetData[month.id].amount;
    }
    const calc = 0;
    const diff = entryAmount - calc;
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
        <td className="budget-calc">{calc}</td>
        <td className="budget-diff">{diff}</td>
      </React.Fragment>
    );
  });

  return monthLines;
}
