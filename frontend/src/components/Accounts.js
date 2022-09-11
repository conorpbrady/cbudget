import React, { useState, useCallback } from 'react';
import { submitNewAccount, submitDeleteAccount } from '../api/accountsApi';
import { useGetAccounts } from '../hooks/useGetAccounts';
import { ConfirmationModal } from './ConfirmationModal';
import { Button, Alert } from 'react-bootstrap';

export default function Accounts() {
  const initInputs = { accountName: '', accountType: 0 };

  const [inputs, setInputs] = useState(initInputs);
  const [fetchToggle, setFetchToggle] = useState(false);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { accounts } = useGetAccounts(fetchToggle);

  const displayConfirmationModal = (type, id) => {
    setType(type);
    setId(id);
    setDeleteMessage(`Are you sure you want to delete ${type} ${id}`);
    setShowConfirmationModal(true);
  };

  const hideConfirmationModal = () => {
    setShowConfirmationModal(false);
  };
  const submitDelete = (type, id) => {
    submitDeleteAccount(id)
      .then((resultMessage) => {
        setResultMessage(resultMessage);
      })
      .catch((errorMessage) => {
        setErrorMessage(errorMessage);
      })
      .finally(() => {
        setShowConfirmationModal(false);
      });
  };

  const handleChange = useCallback(({ target: { name, value } }) =>
    setInputs((prevState) => ({ ...prevState, [name]: value }), [])
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    submitNewAccount(inputs);
    setFetchToggle((prevState) => !prevState);
    setInputs(initInputs);
  };

  return (
    <div>
      {resultMessage && (
        <Alert
          variant="success"
          onClose={() => setResultMessage(null)}
          dismissible
        >
          {resultMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => setErrorMessage(null)}
          dismissible
        >
          {errorMessage}
        </Alert>
      )}
      <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Account Type</th>
          </tr>
        </thead>
        <tbody>
          <AccountList
            accounts={accounts}
            showDeleteModal={displayConfirmationModal}
          />
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
      <ConfirmationModal
        showModal={showConfirmationModal}
        confirmModal={submitDelete}
        hideModal={hideConfirmationModal}
        type={type}
        id={id}
        message={deleteMessage}
      />
    </div>
  );
}

function AccountList(props) {
  const accountList = props.accounts.map((account, index) => {
    return (
      <tr key={index}>
        <td>{account.accountName}</td>
        <td>{account.accountType}</td>
        <td>
          <Button
            className="btn-outline-danger"
            onClick={() => props.showDeleteModal('Account', account.id)}
          >
            x
          </Button>
        </td>
      </tr>
    );
  });
  return accountList;
}
