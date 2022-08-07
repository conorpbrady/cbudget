import React, { Component } from "react";
import Select from "react-select";
import Creatable, { useCreatable } from "react-select/creatable";

import axiosInstance from "../api/axiosApi";

const initTransaction = {
    ta_date: '',
    account: '',
    payee: '',
    category: '',
    note: '',
    in_amount: 0,
    out_amount: 0,
    cleared: false,
    reconciled: false
};

class Transactions extends Component {

  constructor(props) {
    super(props);
   
    this.state = {
      transactions: [],
      newTransaction: initTransaction,
      accounts: [],
      categories: [],
      payees: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

  }
  
  //TODO: Make calls in parallel
  //TODO: Refactor
  componentDidMount() {
    axiosInstance.get('/api/transaction')
     .then(response => {
       this.setState({ transactions: response.data });
       axiosInstance.get('/api/account')
       .then(response => {
         const accounts = response.data
         this.setState({ accounts });
         if(accounts.length) {
           this.setState(prevState => ({
             newTransaction: {
               ...prevState.newTransaction,
               account: `${accounts[0].id}`
             }
           }));
         }
         axiosInstance.get('/api/bucket')
         .then(response => {
           const categories = response.data
           this.setState({ categories });
           if(categories.length) {
             this.setState(prevState => ({
               newTransaction: {
                 ...prevState.newTransaction,
                 category: `${categories[0].id}`
               }
             }));
           }
           axiosInstance.get('/api/payee')
           .then(response => {
             this.setState({ payees: response.data });
           })
           .catch(error => { console.log(error) });
         })
         .catch(error => { console.log(error) });
       })
       .catch(error => { console.log(error) });
     })
     .catch(error => { console.log(error) });
  }

  handleChange(event) {
    const existingTransaction = this.state.newTransaction
    this.setState({ 
      newTransaction: {
        ...existingTransaction,
        [event.target.name]: event.target.value
      }
    });
  }

  handleSelectChange(selectedOption, action) {
      const newTransaction = this.state.newTransaction;
      this.setState(prevState => ({
          newTransaction: {
            ...prevState.newTransaction,
            [action.name]: `${selectedOption.value}`
          }
      }));
  }

  handleCreate(createdOption, action) {
    const newPayee = { name: createdOption };
    axiosInstance.post('/api/payee', newPayee)
     .then(response => {
        const createdPayee = response.data;
        const newTransaction = this.state.newTransaction;
        this.setState(prevState => ({
          payees: [...prevState.payees, createdPayee],
          newTransaction: {
            ...prevState.newTransaction, 
            payee: createdPayee.id
          }
        }));
      })
     .catch(error => { console.log(error); });
    
  }

  handleSubmit(event) {
    event.preventDefault();
    const newTransaction = {
      ...this.state.newTransaction,
      account: parseInt(this.state.newTransaction.account),
      payee: parseInt(this.state.newTransaction.payee),
      category: parseInt(this.state.newTransaction.category)
    }
    axiosInstance.post('/api/transaction', newTransaction)
    .then(response => {
      const createdTransaction = response.data
      console.log(createdTransaction);
      this.setState(prevState => ({
        transactions: [...prevState.transactions, createdTransaction],
        newTransaction: initTransaction
      }));
    })
    .catch(error => { console.log(error); });
  }

  render() {
    const nt = this.state.newTransaction;

    //TODO: Refactor - this could be better done by reworking data structure
    const mapToOptions = (arr) => {
      return arr.map(obj => {
        return {
          label: obj.name,
          value: obj.id
        }
      });
    };

    const accOptions = mapToOptions(this.state.accounts);
    const catOptions = mapToOptions(this.state.categories);
    const payOptions = mapToOptions(this.state.payees);

    const accSelectedOption = accOptions.filter(acc => { return acc.value === parseInt(nt.account)});
    const catSelectedOption = catOptions.filter(cat => { return cat.value === parseInt(nt.category)});
    const paySelectedOption = payOptions.filter(pay => { return pay.value === parseInt(nt.payee)});
    
    return (
      <form onSubmit={this.handleSubmit}>
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
        <tr>
        <td>
          <input type="date" name="ta_date" value={nt.ta_date} onChange={this.handleChange} />
        </td>
        <td>
          <Select
            name="account"
            options={accOptions}
            value={accSelectedOption}
            onChange={this.handleSelectChange}
           />
        </td>
        <td>
          <Creatable
            name="payee"
            options={payOptions}
            value={paySelectedOption}
            onChange={this.handleSelectChange}
            onCreateOption={this.handleCreate}
          />

        </td>
        <td>
          <Select 
            name="category"
            options={catOptions}
            value={catSelectedOption}
            onChange={this.handleSelectChange}
          />
        </td>
        <td>
          <input type="text" name="note" value={nt.note} onChange={this.handleChange} />
        </td>
        <td>
          <input type="number" name="in_amount" value={nt.in_amount} onChange={this.handleChange} />
        </td>
        <td>
          <input type="number" name="out_amount" value={nt.out_amount} onChange={this.handleChange} />
        </td>
        <td>
          <input type="checkbox" name="cleared" value={nt.cleared} onChange={this.handleChange} />
        </td>
        <td>
          <input type="checkbox" name="reconciled" value={nt.reconciled} onChange={this.handleChange} />
        </td>
        <td>
          <input type="submit" value="+" />
        </td>
        </tr>
        <TransactionList transactions={this.state.transactions} />
      </tbody>
      </table>
        
      </form>
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



