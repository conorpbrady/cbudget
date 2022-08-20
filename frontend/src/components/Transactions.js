import React, { useState, useCallback } from 'react';
import { useGetTransactionInfo } from '../hooks/useGetTransactionInfo';
import { submitNewTransaction, submitNewPayee } from '../api/transactionApi';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

export default function Transaction() {
  const initTransaction = {
    ta_date: '',
    account: '',
    payee: '',
    category: '',
    note: '',
    in_amount: 0,
    out_amount: 0,
    cleared: false,
    reconciled: false,
  };

  const [newTransaction, setNewTransaction] = useState(initTransaction);
  const [fetchToggle, setFetchToggle] = useState(false);
  const { transactions, accounts, categories, payees } =
    useGetTransactionInfo(fetchToggle);

  const handleChange = useCallback(({ target: { name, value } }) =>
    setNewTransaction((prevState) => ({ ...prevState, [name]: value }), [])
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    submitNewTransaction(newTransaction);
    setNewTransaction(initTransaction);
    setFetchToggle((prevState) => !prevState);
  };

  const handleSelectChange = (selectedOption, action) => {
    setNewTransaction((prevState) => ({
      ...prevState,
      [action.name]: `${selectedOption.value}`,
    }));
  };

  const handleCreate = (selectedOption) => {
    console.log(selectedOption);
    const newPayee = { name: selectedOption };
    const { newPayeeId } = submitNewPayee(newPayee);
    setNewTransaction((prevState) => ({
      ...prevState,
      payee: newPayeeId,
    }));
  };

  //TODO: Refactor - this could be better done by reworking data structure
  const mapToOptions = (arr) => {
    return arr.map((obj) => {
      return {
        label: obj.name || obj.accountName,
        value: obj.id,
      };
    });
  };

  const accOptions = mapToOptions(accounts);
  const catOptions = mapToOptions(categories);
  const payOptions = mapToOptions(payees);

  const accSelectedOption = accOptions.filter((acc) => {
    return acc.value === parseInt(newTransaction.account);
  });
  const catSelectedOption = catOptions.filter((cat) => {
    return cat.value === parseInt(newTransaction.category);
  });
  const paySelectedOption = payOptions.filter((pay) => {
    return pay.value === parseInt(newTransaction.payee);
  });

  return (
    <form onSubmit={handleSubmit}>
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
              <input
                type="date"
                name="ta_date"
                value={newTransaction.ta_date}
                onChange={handleChange}
              />
            </td>
            <td>
              <Select
                name="account"
                options={accOptions}
                value={accSelectedOption}
                onChange={handleSelectChange}
              />
            </td>
            <td>
              <Creatable
                name="payee"
                options={payOptions}
                value={paySelectedOption}
                onChange={handleSelectChange}
                onCreateOption={handleCreate}
              />
            </td>
            <td>
              <Select
                name="category"
                options={catOptions}
                value={catSelectedOption}
                onChange={handleSelectChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="note"
                value={newTransaction.note}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="in_amount"
                value={newTransaction.in_amount}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="number"
                name="out_amount"
                value={newTransaction.out_amount}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="checkbox"
                name="cleared"
                value={newTransaction.cleared}
                onChange={handleChange}
              />
            </td>
            <td>
              <input
                type="checkbox"
                name="reconciled"
                value={newTransaction.reconciled}
                onChange={handleChange}
              />
            </td>
            <td>
              <input type="submit" value="+" />
            </td>
          </tr>
          <TransactionList transactions={transactions} />
        </tbody>
      </table>
    </form>
  );
}

function TransactionList(props) {
  const transactionList = props.transactions.map((trn, index) => {
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
