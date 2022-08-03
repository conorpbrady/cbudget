import React, { Component } from "react";
import axiosInstance from "../api/axiosApi";

class Transactions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      newTransaction: {}
    };
  }

  componentDidMount() {
    axiosInstance.get('/api/transaction')
     .then(response => {
       this.setState({ transactions: response.data });
     })
     .catch(error => { console.log(error) });
  }

  render() {

    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Account</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Note</th>
            <th>In</th>
            <th>Out</th>
            <th>Cleared</th>
            <th>Reconciled</th>
          </tr>
       </thead>
       <tbody>
        <TransactionList transactions={this.state.transactions} />
      </tbody>
      </table>
    );
  }
}

class TransactionList extends Component {

  render() {
    const transactions = this.props.transactions;
    const transactionList = transactions.map((trn, index) => {
      
      return (
        <tr key={index}>
          <td>{trn.ta_date}</td>
          <td>{trn.ta_account}</td>
          <td>{trn.ta_payee}</td>
          <td>{trn.ta_bucket}</td>
          <td>{trn.note}</td>
          <td>{trn.in_amount}</td>
          <td>{trn.out_amount}</td>
          <td>{trn.cleared}</td>
          <td>{trn.reconciled}</td>
        </tr>
      );
    });

    return transactionList;
  }
}

export default Transactions;



