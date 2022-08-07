import React, { Component } from 'react';
import TransactionService from '../transactionservice';

const transactionService = new TransactionService();

class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
    };
  }

  componentDidMount() {
    transactionService.getTransactions().then((result) => {
      this.setState( { transactions: result.data });
      console.log("hello");
  });
  }

  render() {

    return (
      <div className="transaction-list">
        <table>
          <thead>
          <tr>
            <th>Date</th>
            <th>Account</th>
            <th>Payee</th>
            <th>Note</th>
            <th>In</th>
            <th>Out</th>
          </tr>
          </thead>
          <tbody>
            { this.state.transactions.map( t =>
                <tr key={t.id}>
                  <td>{t.transDate}</td>
                  <td>{t.transAccount}</td>
                  <td>{t.Payee}</td>
                  <td>{t.description}</td>
                  <td>{t.inAmount}</td>
                  <td>{t.outAmount}</td>
                </tr>
            )}
          </tbody>
         </table>
       </div>
                );
  }
}

export default TransactionList;
