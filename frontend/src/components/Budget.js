import React, { Component } from 'react';
import axiosInstance from '../api/axiosApi';
import './Budget.css';
import { splitMonthCatId } from '../utils/utils';

class Budget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      months: [
        { id: 1, key: '0822' },
        { id: 2, key: '0922' },
        { id: 3, key: '1022' },
      ],
      budget: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    const transformData = (data) => {
      let output = {};
      data.map((item) => {
        output[item.category] = output[item.category] || {};
        output[item.category] = {
          ...output[item.category],
          [item.month.id]: {
            id: item.id,
            initAmount: item.amount,
            amount: item.amount
          }
        }
      });
      return output;
    };
    const monthString = this.state.months.map((obj) => obj.id).join(',');
    const monthUrl = `/api/monthlybudget?months=${monthString}`;
    axiosInstance
      .get(monthUrl)
      .then((response) => {
        const budgetData = transformData(response.data);
        this.setState({ budget: budgetData });
      })
      .catch((error) => {
        console.log(error);
      });

    axiosInstance
      .get('/api/category')
      .then((response) => {
        this.setState({ categories: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange(event) {
    const month = event.target.dataset.month;
    const category = event.target.dataset.category;
    if(this.state.budget[category] === undefined) {
      this.setState(prevState => ({
        budget: {
          ...prevState.budget,
          [category]: {
            [month]: {}
          }
        }
      }));
    }
    this.setState((prevState) => ({
      budget: {
        ...prevState.budget,
        [category]: {
          ...prevState.budget[category],
          [month]: {
            ...prevState.budget[category][month],
            amount: event.target.value
          }
        },
      },
    }));
  }

  updateInitAmount() {

    }
  // TODO: This is in desperate need of a refactor
  // Try to come up with a way to avoid nested state for budget
  // PUT and POST methods can re-use the same code to update state
  //
  handleBlur(event) {
   
    const amount = parseInt(event.target.value);
    const month = event.target.dataset.month;
    const category = event.target.dataset.category;
    const budget = this.state.budget;

    let existingAmount = 0;
    if (budget.hasOwnProperty(category) && budget[category].hasOwnProperty(month)) {
      existingAmount = parseInt(this.state.budget[category][month].initAmount);
    }
    
    if(amount  === 0) {
      return; 
    }

    if (amount === existingAmount) {
      return;
    }

    const newBudgetEntry = {
      month: month, 
      category: category, 
      amount: amount
    };
    const entryId = event.target.dataset.entry;
    if(entryId === 0 || entryId === undefined) {
      axiosInstance.post('/api/monthlybudget', newBudgetEntry)
        .then(response => {
          
          if(response.status === 201) {
            this.setState(prevState => {
              let prevCategory = {}
              if(prevState.budget.hasOwnProperty(response.data.category)) {
                prevCategory = prevState.budget[response.data.category];
              }
              return ({
                budget: {
                ...prevState.budget,
                [response.data.category]: { 
                  ...prevCategory,
                  [response.data.month.id]: {
                    id: response.data.id,
                    amount: response.data.amount,
                    initAmount: response.data.amount
                  }
                }
              }})
            });
          }
        })
        .catch(error => { console.log(error); });
    } else {
      axiosInstance.put(`/api/monthlybudget/entry/${entryId}`, newBudgetEntry)
        .then(response => {
          if(response.status === 200) {
            this.setState(prevState => (
              {
                budget: {
                  ...prevState.budget,
                  [response.data.category]: {
                    ...prevState.budget[response.data.category],
                    [response.data.month.id]: {
                      id: response.data.id,
                      amount: response.data.amount,
                      initAmount: response.data.amount
                    }
                  }
                }
              }
            ))} 
        })
        .catch(error => { console.log(error); });
    }
  }



  render() {
    const monthIncome = 0;
    const monthSpend = 0;
    const monthDiff = monthIncome - monthSpend;
    return (
      <div className="budget-container">
        <table className="budget-table">
          <thead>
            <tr>
              <th>Categories</th>
              {this.state.months.map((month, index) => {
                return (
                  <th key={index} colSpan="3">
                    {month.key}
                  </th>
                );
              })}
            </tr>
            <MonthlySummaryLine
              months={this.state.months}
              message="Income: "
              value={monthIncome}
            />
            <MonthlySummaryLine
              months={this.state.months}
              message="Spent: "
              value={monthSpend}
            />
            <MonthlySummaryLine
              months={this.state.months}
              message="Difference: "
              value={monthDiff}
              firstCell="Categories"
            />
            <tr></tr>
          </thead>

          <tbody>
            {this.state.categories.map((category) => {
              return (
                <React.Fragment key={category.id.toString()}>
                  <tr className="heading-row">
                    <td className="budget-cat cat-heading">{category.name}</td>
                    <HeadingLines months={this.state.months} />
                  </tr>

                  <BudgetLines
                    months={this.state.months}
                    budget={this.state.budget}
                    subcategories={category.bucket}
                    handleChange={this.handleChange}
                    handleBlur={this.handleBlur}
                  />
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
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
    return (
      <React.Fragment key={index}>
        <td className="budget-entry cat-heading">0.00</td>
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
    if(budgetData.hasOwnProperty(month.id)) {
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

export default Budget;
