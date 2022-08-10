import React, { Component } from "react";
import axiosInstance from "../api/axiosApi";
import "./Budget.css";

class Budget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      months: ['0822', '0922', '1022'],
      budget: {}
    }
  }

  componentDidMount() {
    const transformData = (data) => {
      let output = {}
      data.map(item => {
        output[item.category] = {[item.month]: item.amount}
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
  
    axiosInstance.get('/api/category')
      .then(response => {
         this.setState({ categories: response.data });
      })
      .catch(error => { console.log(error) });

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
          { 
            this.state.months.map((month, index) => {
              return (<th key={index} colSpan="3">{month}</th>);
            })
          }
          </tr>
          <MonthlySummaryLine months={this.state.months} message="Income: " value={monthIncome} />
          <MonthlySummaryLine months={this.state.months} message="Spent: " value={monthSpend} />
          <MonthlySummaryLine months={this.state.months} message="Difference: " value={monthDiff}
            firstCell="Categories" />
          <tr></tr>
         </thead>

         <tbody>
          {
            this.state.categories.map((category, index) => {
                
              return (
                <React.Fragment key={category.id.toString()}>
                <tr className='heading-row'>
                <td className='budget-cat cat-heading'>{category.name}</td>
                
                <HeadingLines months={this.state.months} />
                </tr>
                <BudgetLines 
                  months={this.state.months}
                  budget={this.state.budget}
                  subcategories={category.bucket} />
                </React.Fragment>
             )})
            }
          </tbody>
        </table>
      </div>
    );
  }
}

function MonthlySummaryLine(props) {
  return ( 
      <tr>
        <td className='budget-cat'>{props.firstCell}</td>
    {
      props.months.map(month => {
        return (
          <td className='monthly-summary' key={month} colSpan="3">{props.message}</td>
        );
      })
    }
      </tr>
  );
}

function HeadingLines(props) {
  const months = props.months || []
  const headingLines = months.map((month, index) => {

    return (
      <React.Fragment key={index}>
        <td className='budget-entry cat-heading'>0.00</td>
        <td className='budget-calc cat-heading'>0.00</td>
        <td className='budget-diff cat-heading'>0.00</td>
      </React.Fragment>
    );
  });
  return headingLines;
}

function BudgetLines(props) {
  const sub = props.subcategories || []
  const months = props.months || []
  const budgetLines = sub.map((subcategory, index) => {
    return (
    <tr key={subcategory.id.toString()}>
      <td className='budget-cat'>  {subcategory.name}</td>
      <MonthLines
        budget={props.budget[subcategory.name]}
        months={months}
        subcategory={subcategory}
      />
    </tr>
    );
  });
  return budgetLines;
}

function MonthLines(props) {
  const budgetData = props.budget || {};
  const subcategory = props.subcategory || "";
  const monthLines = props.months.map((month, index) => {
    const entry = budgetData[month] || 0;
    const calc = 0;
    const diff = entry - calc;
    return ( 
      <React.Fragment key={index}>
        <td className='budget-entry'>{entry}</td>
        <td className='budget-calc'>{calc}</td>
        <td className='budget-diff'>{diff}</td>
      </React.Fragment>
  );
  });

  return monthLines;
}

export default Budget;
