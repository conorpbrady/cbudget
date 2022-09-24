import { useState } from 'react';

export const useDeleteModal = (submitOnDelete) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);
  const [resultType, setResultType] = useState(null);

  const displayConfirmationModal = (type, id) => {
    setType(type);
    setId(id);
    setDeleteMessage(`Are you sure you want to delete ${type} ${id}`);
    setShowConfirmationModal(true);
  };

  const hideConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const clearResult = () => {
    setResultMessage(null);
  };

  const onConfirm = (type, id) => {
    submitOnDelete(type, id)
      .then((resultMessage) => {
        setResultMessage(resultMessage);
        setResultType('success');
      })
      .catch((resultMessage) => {
        setResultMessage(resultMessage);
        setResultType('danger');
      })
      .finally(() => {
        setShowConfirmationModal(false);
      });
  };

  const modalChildren = {
    showConfirmationModal,
    hideConfirmationModal,
    onConfirm,
    id,
    type,
    deleteMessage,
  };

  return {
    resultMessage,
    resultType,
    clearResult,
    displayConfirmationModal,
    setShowConfirmationModal,
    modalChildren,
  };
};
