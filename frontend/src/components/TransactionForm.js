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
  const mapToOptions = (arr) => {
    return arr.map((obj) => {
      return {
        label: obj.name || obj.accountName,
        value: obj.id,
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
  const accOptions = mapToOptions(props.accounts);
  const catOptions = mapToOptions(props.categories);
  const payOptions = mapToOptions(props.payees);

  const accSelectedOption = getSelectedOption(
    accOptions,
    props.details.account_id
  );
  const catSelectedOption = getSelectedOption(
    catOptions,
    props.details.category_id
  );
  const paySelectedOption = getSelectedOption(
    payOptions,
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
          disabled={props.transactionBeingEdited}
        />
      </td>
      <td>
        <Select
          name="account"
          options={accOptions}
          value={accSelectedOption}
          onChange={props.handleSelectChange}
          isDisabled={props.transactionBeingEdited}
        />
      </td>
      <td>
        <Creatable
          name="payee"
          options={payOptions}
          value={paySelectedOption}
          onChange={props.handleSelectChange}
          onCreateOption={props.handleCreate}
          isDisabled={props.transactionBeingEdited}
        />
      </td>
      <td>
        <Select
          name="category"
          options={catOptions}
          value={catSelectedOption}
          onChange={props.handleSelectChange}
          isDisabled={props.transactionBeingEdited}
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
          disabled={props.transactionBeingEdited}
        />
      </td>
      <td>
        <input
          type="checkbox"
          name="reconciled"
          value={props.details.reconciled}
          onChange={props.handleChange}
          disabled={props.transactionBeingEdited}
        />
      </td>
      {props.transactionBeingEdited ? (
        <></>
      ) : (
        <>
          <td>
            <Button variant="outline-danger">
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() =>
                  props.handleDelete('transaction', props.details.id)
                }
              />
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
