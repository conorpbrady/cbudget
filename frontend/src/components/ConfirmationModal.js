import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ConfirmationModal(props) {
  return (
    <Modal
      show={props.showConfirmationModal}
      onHide={props.hideConfirmationModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="alert alert-danger">{props.deleteMessage}</div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="default" onClick={props.hideConfirmationModal}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => props.onConfirm(props.type, props.id)}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
