import React, { useState, useCallback } from 'react';
import { Table, Alert } from 'react-bootstrap';

import { useGetTransactionInfo } from '../hooks/useGetTransactionInfo';
import { useDeleteModal } from '../hooks/useDeleteModal';

import TransactionForm from './TransactionForm';
import ConfirmationModal from './ConfirmationModal';

import {
  submitEditTransaction,
  submitNewTransaction,
  submitNewPayee,
  submitDeleteTransaction,
} from '../api/transactionApi';

export default function Transaction() {
  const initTransaction = {
    ta_date: '',
    account: '',
    account_id: '',
    payee: '',
    payee_id: '',
    category: '',
    category_id: '',
    note: '',
    in_amount: 0,
    out_amount: 0,
    cleared: false,
    reconciled: false,
  };

  const [transactionToEdit, setTransactionToEdit] = useState(0);

  const [newTransaction, setNewTransaction] = useState(initTransaction);
  const [editedTransaction, setEditedTransaction] = useState(initTransaction);
  const [fetchToggle, setFetchToggle] = useState(false);
  const { transactions, accounts, categories, payees } =
    useGetTransactionInfo(fetchToggle);
  const {
    resultMessage,
    resultType,
    clearResult,
    displayConfirmationModal,
    modalChildren,
  } = useDeleteModal(submitDeleteTransaction, () => {
    setFetchToggle(!fetchToggle);
    setTransactionToEdit(0);
  });

  const handleMakeTransactionEditable = (transactionObject) => {
    if (transactionToEdit != 0) {
      return;
    }
    setTransactionToEdit(transactionObject.id);
    setEditedTransaction(transactionObject);
  };

  const handleChange = useCallback(({ target: { name, value } }) => {
    setNewTransaction((prevState) => ({ ...prevState, [name]: value }), []);
  });

  const handleEditChange = useCallback(({ target: { name, value } }) => {
    setEditedTransaction((prevState) => ({ ...prevState, [name]: value }), []);
  });

  const handleSelectChange = (selectedOption, action) => {
    setNewTransaction((prevState) => ({
      ...prevState,
      [`${action.name}_id`]: `${selectedOption.value}`,
      [action.name]: `${selectedOption.label}`,
    }));
  };

  const handleSelectEditChange = (selectedOption, action) => {
    setEditedTransaction((prevState) => ({
      ...prevState,
      [`${action.name}_id`]: `${selectedOption.value}`,
      [action.name]: `${selectedOption.label}`,
    }));
  };

  const handleCreate = (selectedOption) => {
    const newPayee = { name: selectedOption };
    const { newPayeeId } = submitNewPayee(newPayee);
    setNewTransaction((prevState) => ({
      ...prevState,
      payee: newPayeeId,
    }));
  };
  const handleSubmit = (event, isEditTransaction) => {
    event.preventDefault();

    if (isEditTransaction) {
      submitEditTransaction(editedTransaction);
      setTransactionToEdit(0);
    } else {
      submitNewTransaction(newTransaction);
      setNewTransaction(initTransaction);
    }
    setFetchToggle((prevState) => !prevState);
  };

  const handleCancel = () => {
    setTransactionToEdit(0);
    setEditedTransaction(initTransaction);
  };

  const newTransactionForm = (
    <TransactionForm
      details={newTransaction}
      accounts={accounts}
      categories={categories}
      payees={payees}
      handleChange={handleChange}
      handleCreate={handleCreate}
      handleDelete={displayConfirmationModal}
      handleSelectChange={handleSelectChange}
      handleCancel={handleCancel}
      transactionBeingEdited={transactionToEdit != 0}
    />
  );

  const editTransactionForm = (
    <TransactionForm
      details={editedTransaction}
      accounts={accounts}
      categories={categories}
      payees={payees}
      handleChange={handleEditChange}
      handleCreate={handleCreate}
      handleDelete={displayConfirmationModal}
      handleSelectChange={handleSelectEditChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
    />
  );
  return (
    <>
      {resultMessage && (
        <Alert variant={resultType} onClose={clearResult} dismissible>
          {resultMessage}
        </Alert>
      )}
      <form onSubmit={(e) => handleSubmit(e, transactionToEdit != 0)}>
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
              {...{
                transactions,
                transactionToEdit,
                newTransactionForm,
                editTransactionForm,
                handleMakeTransactionEditable,
              }}
            />
          </tbody>
        </Table>
        <ConfirmationModal {...modalChildren} />
      </form>
    </>
  );
}

function TransactionList(props) {
  const transactionList = props.transactions.map((trn, index) => {
    return trn.id === props.transactionToEdit ? (
      <tr key={index}>{props.editTransactionForm}</tr>
    ) : (
      <tr key={index} onClick={() => props.handleMakeTransactionEditable(trn)}>
        <DisplayTransaction details={trn} />
      </tr>
    );
  });

  return (
    <>
      <tr>{props.newTransactionForm}</tr>
      {transactionList}
    </>
  );
}

function DisplayTransaction(props) {
  return (
    <>
      <td>{props.details.ta_date}</td>
      <td>{props.details.account}</td>
      <td>{props.details.payee}</td>
      <td>{props.details.category}</td>
      <td>{props.details.note}</td>
      <td>{props.details.in_amount}</td>
      <td>{props.details.out_amount}</td>
      <td>{props.details.cleared}</td>
      <td>{props.details.reconciled}</td>
    </>
  );
}
