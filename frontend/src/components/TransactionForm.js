import React from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTrash,
  faLeftLong,
} from '@fortawesome/free-solid-svg-icons';

export default function TransactionForm(props) {
  const mapToOptions = (arr, groupName) => {
    return arr.map((obj) => {
      return {
        label: obj.name || obj.accountName,
        value: obj.id,
        group: groupName,
      };
    });
  };

  const getSelectedOption = (arrOptions, identifier) => {
    if (isNaN(identifier)) {
      return arrOptions.filter((arr) => {
        return arr.label === identifier;
      });
    } else {
      return arrOptions.filter((arr) => {
        return arr.value === parseInt(identifier);
      });
    }
  };

  let fullCategories = [...props.categories];
  if (props.details.isTransfer) {
    fullCategories = [...fullCategories, ...props.transferCat];
  }
  const accOptions = mapToOptions(props.accounts, 'account');
  const catOptions = mapToOptions(fullCategories, 'category');
  const payOptions = mapToOptions(props.payees, 'payee');

  const payAccOptions = [
    {
      label: 'Payees',
      options: payOptions,
    },
    {
      label: 'Transfers',
      options: accOptions,
    },
  ];
  const accSelectedOption = getSelectedOption(
    accOptions,
    props.details.account_id
  );
  if (props.details.isTransfer) {
    console.log(props.transferCat[0]);
    props.details.category_id = props.transferCat[0].id;
  }
  const catSelectedOption = getSelectedOption(
    catOptions,
    props.details.category_id
  );
  const paySelectedOption = getSelectedOption(
    payAccOptions,
    props.details.payee_id
  );

  return (
    <>
      <td>
        <input
          type="date"
          name="ta_date"
          value={props.details.ta_date}
          onChange={props.handleChange}
          disabled={props.transactionBeingEdited || props.details.system}
        />
      </td>
      <td>
        <Select
          name="account"
          options={accOptions}
          value={accSelectedOption}
          onChange={props.handleSelectChange}
          isDisabled={props.transactionBeingEdited || props.details.system}
        />
      </td>
      <td>
        <Creatable
          name="payee"
          options={payAccOptions}
          value={paySelectedOption}
          onChange={props.handleSelectChange}
          onCreateOption={props.handleCreate}
          isDisabled={props.transactionBeingEdited || props.details.system}
        />
      </td>
      <td>
        <Select
          name="category"
          options={catOptions}
          value={catSelectedOption}
          onChange={props.handleSelectChange}
          isDisabled={
            props.transactionBeingEdited ||
            props.details.system ||
            props.details.isTransfer
          }
        />
      </td>
      <td>
        <input
          type="text"
          name="note"
          value={props.details.note}
          onChange={props.handleChange}
          disabled={props.transactionBeingEdited}
        />
      </td>
      <td>
        <input
          type="number"
          name="in_amount"
          value={props.details.in_amount}
          onChange={props.handleChange}
          disabled={props.transactionBeingEdited}
        />
      </td>
      <td>
        <input
          type="number"
          name="out_amount"
          value={props.details.out_amount}
          onChange={props.handleChange}
          disabled={props.transactionBeingEdited}
        />
      </td>
      <td>
        <input
          type="checkbox"
          name="cleared"
          value={props.details.cleared}
          onChange={props.handleChange}
          disabled={props.transactionBeingEdited || props.details.system}
        />
      </td>
      <td>
        <input
          type="checkbox"
          name="reconciled"
          value={props.details.reconciled}
          onChange={props.handleChange}
          disabled={props.transactionBeingEdited || props.details.system}
        />
      </td>
      {props.transactionBeingEdited ? (
        <></>
      ) : (
        <>
          <td>
            <Button
              variant="outline-danger"
              onClick={() =>
                props.handleDelete('transaction', props.details.id)
              }
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <Button variant="outline-warning" onClick={props.handleCancel}>
              <FontAwesomeIcon icon={faLeftLong} />
            </Button>
          </td>
          <td>
            <Button type="submit" variant="outline-success">
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </td>
        </>
      )}
    </>
  );
}
