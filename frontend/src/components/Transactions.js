import React, { useState, useCallback } from 'react';
import { useGetTransactionInfo } from '../hooks/useGetTransactionInfo';
import TransactionForm from './TransactionForm';
import { submitNewTransaction, submitNewPayee } from '../api/transactionApi';
import { Table, Alert, Button } from 'react-bootstrap';

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

  const [transactionToEdit, setTransactionToEdit] = useState(0);

  const [newTransaction, setNewTransaction] = useState(initTransaction);
  const [fetchToggle, setFetchToggle] = useState(false);
  const { transactions, accounts, categories, payees } =
    useGetTransactionInfo(fetchToggle);

  const handleMakeTransactionEditable = (transactionId) => {
    if (transactionToEdit != 0) {
      return;
    }
    setTransactionToEdit(transactionId);
  };

  const handleChange = useCallback(({ target: { name, value } }) => {
    console.log('hi');
    setNewTransaction((prevState) => ({ ...prevState, [name]: value }), []);
  });

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
  const handleSubmit = (event, editedTransaction) => {
    event.preventDefault();

    if (editedTransaction) {
      console.log('do something to edit');
    } else {
      submitNewTransaction(newTransaction);
      setNewTransaction(initTransaction);
      setFetchToggle((prevState) => !prevState);
    }
  };

  const handleCancel = () => {
    setTransactionToEdit(0);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, setTransactionToEdit != 0)}>
      <Table striped>
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
          <TransactionList
            transactions={transactions}
            transactionToEdit={transactionToEdit}
            handleMakeTransactionEditable={handleMakeTransactionEditable}
            accounts={accounts}
            categories={categories}
            payees={payees}
            handleChange={handleChange}
            handleCreate={handleCreate}
            handleSelectChange={handleSelectChange}
            newTransaction={newTransaction}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        </tbody>
      </Table>
    </form>
  );
}

function TransactionList(props) {
  const showAddTransactionRow = props.transactionToEdit === 0;
  const transactionList = props.transactions.map((trn, index) => {
    return (
      <tr
        key={index}
        onClick={() => props.handleMakeTransactionEditable(trn.id)}
      >
        {trn.id === props.transactionToEdit ? (
          <TransactionForm
            details={trn}
            accounts={props.accounts}
            categories={props.categories}
            payees={props.payees}
            handleChange={props.handleChange}
            handleCreate={props.handleCreate}
            handleSeletChange={props.handleSelectChange}
            handleSubmit={props.handleSubmit}
            handleCancel={props.handleCancel}
          />
        ) : (
          <DisplayTransaction details={trn} />
        )}
      </tr>
    );
  });

  return (
    <>
      <tr>
        <TransactionForm
          details={props.newTransaction}
          accounts={props.accounts}
          categories={props.categories}
          payees={props.payees}
          handleChange={props.handleChange}
          handleCreate={props.handleCreate}
          handleSelectChange={props.handleSelectChange}
          handleCancel={props.handleCancel}
          transactionBeingEdited={!showAddTransactionRow}
        />
      </tr>
      {transactionList}
    </>
  );
}

function DisplayTransaction(props) {
  return (
    <>
      <td>{props.details.ta_date}</td>
      <td>{props.details.ta_account}</td>
      <td>{props.details.ta_payee}</td>
      <td>{props.details.ta_bucket}</td>
      <td>{props.details.note}</td>
      <td>{props.details.in_amount}</td>
      <td>{props.details.out_amount}</td>
      <td>{props.details.cleared}</td>
      <td>{props.details.reconciled}</td>
    </>
  );
}
