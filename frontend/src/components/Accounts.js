import React, { Component } from 'react';
import axiosInstance from '../api/axiosApi';

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      account_name: '',
      account_type: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axiosInstance
      .get('/api/account')
      .then((response) => {
        this.setState({ accounts: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newAccount = {
      name: this.state.account_name,
      account_type: this.state.account_type,
    };
    axiosInstance
      .post('/api/account', newAccount)
      .then(() => {
        const emptyState = {
          accounts: this.state.accounts.concat(newAccount),
          account_name: '',
          account_type: 0,
        };
        this.setState(emptyState);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Account Type</th>
            </tr>
          </thead>
          <tbody>
            <AccountList accounts={this.state.accounts} />
          </tbody>
        </table>

        <form onSubmit={this.handleSubmit}>
          <label>
            Account Name:
            <input
              name="account_name"
              type="text"
              value={this.state.account_name}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Account Type:
            <select name="account_type" onChange={this.handleChange}>
              <option value="0">Cash</option>
              <option value="1">Checking</option>
              <option value="2">Savings</option>
              <option value="3">Credit Card</option>
            </select>
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

class AccountList extends Component {
  render() {
    const accounts = this.props.accounts;
    const accountList = accounts.map((account, index) => {
      return (
        <tr key={index}>
          <td>{account.name}</td>
          <td>{account.account_type}</td>
        </tr>
      );
    });

    return accountList;
  }
}
export default Accounts;
