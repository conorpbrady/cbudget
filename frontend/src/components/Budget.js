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
      budgetSum: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    const transformData = (data) => {
      let output = {};
      data.map((item) => {
        output[item.category.id] = output[item.category.id] || {};
        output[item.category.id] = {
          ...output[item.category.id],
          parentId: item.category.parent,
          [item.month.id]: {
            id: item.id,
            initAmount: item.amount,
            amount: item.amount
          }
        }
      });
      return output;
    };
    const sumMonthlyTotals = (budget, categories) => {
 
      categories.map(category => {
        this.state.months.map(month => {
          let sum = 0;
          category.bucket.map(subcategory => {
            if(budget.hasOwnProperty(subcategory.id) && budget[subcategory.id].hasOwnProperty(month.id)) {
              sum += parseInt(budget[subcategory.id][month.id].amount);
            }
          });
          this.setState(prevState => (
            {
              budgetSum: {
                ...prevState.budgetSum,
                [category.id]: {
                  ...prevState.budgetSum[category.id],
                  [month.id]: sum
                }
              }
            }
          ));
        });
      });
    }

    const monthString = this.state.months.map((obj) => obj.id).join(',');
    const monthUrl = `/api/monthlybudget?months=${monthString}`;
    
    axiosInstance
      .get('/api/category')
        .then((response) => {
          const categories = response.data
          this.setState({ categories });
          axiosInstance
            .get(monthUrl)
            .then((response) => {
              const budgetData = transformData(response.data);
              this.setState({ budget: budgetData });
              sumMonthlyTotals(budgetData, categories);
          })
        .catch((error) => {
          console.log(error);
        });
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

  updateBudgetWithNewEntry(category, month, amount, entryId, parentId, existingAmount) {
    this.setState(prevState => {
        let prevCategory = {}
        if(prevState.budget.hasOwnProperty(category)) {
          prevCategory = prevState.budget[category];
        }
        return ({
          budget: {
          ...prevState.budget,
          [category]: { 
            ...prevCategory,
            [month]: {
              id: entryId,
              amount: amount,
              initAmount: amount
            }
          }
        }})
      });
      
    this.setState(prevState => {
        const prevValue = prevState.budgetSum[parentId][month] || 0
        const prevSum = parseInt(prevValue);
        const deltaSum = parseInt(amount) - parseInt(existingAmount);
        const newSum = prevSum + deltaSum;
        return {
          budgetSum: {
            ...prevState.budgetSum,
            [parentId]: {
              ...prevState.budgetSum[parentId],
              [month]: newSum 
            }
         }
      }
      });
  }
  // TODO: This is in desperate need of a refactor
  // Try to come up with a way to avoid nested state for budget
  // PUT and POST methods can re-use the same code to update state
  //
  handleBlur(event) {
   
    const amount = parseInt(event.target.value);
    const month = event.target.dataset.month;
    const category = event.target.dataset.category;
    const parentId = event.target.dataset.parentid;
    const budget = this.state.budget;


    let existingAmount = 0;
    if (budget.hasOwnProperty(category) && budget[category].hasOwnProperty(month)) {
      existingAmount = parseInt(this.state.budget[category][month].initAmount);
    }

    existingAmount = existingAmount || 0;

    if(amount === 0 || amount === existingAmount) {
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
            this.updateBudgetWithNewEntry(
              response.data.category.id,
              response.data.month.id,
              response.data.amount,
              response.data.id,
              parentId,
              existingAmount
            );
          }
        })
        .catch(error => { console.log(error); });
    } else {
      axiosInstance.put(`/api/monthlybudget/entry/${entryId}`, newBudgetEntry)
        .then(response => {
          if(response.status === 200) {
            this.updateBudgetWithNewEntry(
              response.data.category.id,
              response.data.month.id,
              response.data.amount,
              response.data.id,
              parentId,
              existingAmount
            );
          } 
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
              const categorySum = this.state.budgetSum[category.id] || {}
              return (
                <React.Fragment key={category.id.toString()}>
                  <tr className="heading-row">
                    <td className="budget-cat cat-heading">{category.name}</td>
                    <HeadingLines months={this.state.months} budgetSum={categorySum} />
                  </tr>

                  <BudgetLines
                    months={this.state.months}
                    budget={this.state.budget}
                    subcategories={category.bucket}
                    parentId={category.id}
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
    let entrySum = '0.00';
    if(props.budgetSum.hasOwnProperty(month.id)) {
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

export default Budget;
