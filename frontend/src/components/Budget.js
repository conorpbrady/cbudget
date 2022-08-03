import React, { Component } from "react";
import axiosInstance from "../api/axiosApi";
import "./Budget.css";

class Budget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      months: ['0822', '0922', '1022'],
      budget: {}
    }
  }

  componentDidMount() {
    const transformData = (data) => {
      let output = {}
      data.map(item => {
        output[item.month] = output[item.month] || []
        output[item.month].push({
          category: item.category,
          amount: item.amount
        });
      });
      return output
    }
    const monthString = this.state.months.join(',');
    const monthUrl = `/api/monthlybudget?months=${monthString}`;
    axiosInstance.get(monthUrl)
    .then(response => {
      const budgetData = transformData(response.data);
     this.setState( { budget: budgetData });
    })
    .catch(error => { console.log(error) } );
  }

  render() {
    const monthList = this.state.months.map((month, index) => {
       return <MonthlyBudget key={index} month={month} budget={ this.state.budget[month] } />
    });
    return (
      <div className="budget-container">
        {monthList}
      </div>
    );
  }
}

class MonthlyBudget extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      budget: []
    };
  }

  render() {
    return (
      <div className="month-container">
        <div className="month-header">
         <p>{this.props.month}</p>
        </div>
        <div className="month-body">
          <div className="budget-entry">
            <table>
            <tbody>
            <BudgetList budget={this.props.budget} />
            </tbody>
            </table>
          </div>
        </div>
       </div>
    );
  }
}

class BudgetList extends Component {

  render() {
    const budget = this.props.budget || [];
    const budgetList = budget.map((entry, index) => {
      const diff = 0 - entry.amount;     
      return (
        <tr key={index} className="budget-item">
            <td className="budget-cat">
              {entry.category}
            </td>
            <td className="budget-calc">
              0
            </td>
            <td className="budget-entry">
              {entry.amount}
            </td>
            <td className="budget-diff">
              {diff}
            </td>
        </tr>
      );
    });
    return budgetList;
  }
}

export default Budget;
