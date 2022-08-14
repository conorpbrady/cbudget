import React, { Component } from 'react';
import axiosInstance from '../api/axiosApi';
import './Budget.css';

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
  }

  componentDidMount() {
    const transformData = (data) => {
      let output = {};
      data.map((item) => {
        output[item.category] = output[item.category] || {};
        output[item.category] = {
          ...output[item.category],
          [item.month.id]: item.amount,
        };
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
    const [monthId, categoryId] = event.target.name
      .split('-')
      .map((s) => s.substring(1));
    this.setState((prevState) => ({
      budget: {
        ...prevState.budget,
        [categoryId]: {
          ...prevState.budget[categoryId],
          [monthId]: event.target.value,
        },
      },
    }));
  }

  handleBlur(event) {}

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
        />
      </tr>
    );
  });
  return budgetLines;
}

function MonthLines(props) {
  const budgetData = props.budget || {};
  const monthLines = props.months.map((month, index) => {
    const entry = budgetData[month.id] || 0;
    const calc = 0;
    const diff = entry - calc;
    return (
      <React.Fragment key={index}>
        <td className="budget-entry">
          <input
            type="number"
            name={`m${month.id}-c${props.subcategoryId}`}
            value={entry}
            onChange={props.handleChange}
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
