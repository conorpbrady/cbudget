import React, { useState, useCallback } from 'react';
import { submitNewAccount } from '../api/accountsApi';
import { useGetAccounts } from '../hooks/useGetAccounts';

export default function Accounts() {
  const initInputs = { accountName: '', accountType: 0 };

  const [inputs, setInputs] = useState(initInputs);
  const [fetchToggle, setFetchToggle] = useState(false);

  const { accounts } = useGetAccounts(fetchToggle);

  const handleChange = useCallback(({ target: { name, value } }) =>
    setInputs((prevState) => ({ ...prevState, [name]: value }), [])
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    submitNewAccount(inputs);
    setFetchToggle(prevState => !prevState);
    setInputs(initInputs);
  };

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
          <AccountList accounts={accounts} />
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <label>
          Account Name:
          <input
            name="accountName"
            type="text"
            value={inputs.accountName}
            onChange={handleChange}
          />
        </label>
        <label>
          Account Type:
          <select name="accountType" onChange={handleChange}>
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

function AccountList(props) {
  const accountList = props.accounts.map((account, index) => {
    return (
      <tr key={index}>
        <td>{account.accountName}</td>
        <td>{account.accountType}</td>
      </tr>
    );
  });
  return accountList;
}
