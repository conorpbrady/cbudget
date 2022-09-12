import React, { useEffect, useState, Fragment } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import axiosInstance from '../api/axiosApi';
import {
  useGetCategories,
  useGetFirstCategory,
} from '../hooks/useGetCategories';
import {
  submitNewGroup,
  submitNewBucket,
  submitDeleteCategory,
} from '../api/categoryApi';
import { ConfirmationModal } from './ConfirmationModal';

export default function Categories() {
  const { categories, firstCategoryId } = useGetCategories();
  const initBucket = { name: '', parent: firstCategoryId };

  const [newBucket, setNewBucket] = useState(initBucket);
  const [newGroup, setNewGroup] = useState('');

  // TODO: This exact code is in Accounts component, find a way to lift it out and reuse
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
    submitDeleteCategory(type, id)
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

  // TODO: This seems unnecessary - Due to state lifecycle / async calls, parent is not
  // getting updated with a valid category ID on the first render
  useEffect(() => {
    if (newBucket.parent === 0) {
      setNewBucket(initBucket);
    }
  }, [firstCategoryId]);

  const handleGroupChange = (event) => {
    setNewGroup(event.target.value);
  };
  const handleGroupSubmit = (event) => {
    event.preventDefault();
    setNewGroup('');
  };

  const handleBucketChange = (event) => {
    setNewBucket({ ...newBucket, [event.target.name]: event.target.value });
  };

  const handleBucketSubmit = (event) => {
    event.preventDefault();
    submitNewBucket(newBucket);
    setNewBucket(initBucket);
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
      <Table striped>
        <thead>
          <tr>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <CategoryList
            categories={categories}
            showDeleteModal={displayConfirmationModal}
          />
        </tbody>
      </Table>
      <div>
        <Group
          newGroup={newGroup}
          onGroupChange={handleGroupChange}
          onGroupSubmit={handleGroupSubmit}
        />
        <Bucket
          categories={categories}
          newBucket={newBucket}
          onBucketChange={handleBucketChange}
          onBucketSubmit={handleBucketSubmit}
        />
      </div>
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

function CategoryList(props) {
  const categoryList = props.categories.map((category) => {
    return (
      <Fragment key={category.id}>
        <tr>
          <td>
            <strong>{category.name}</strong>
          </td>
          <td>
            <Button
              variant="outline-danger"
              onClick={() => props.showDeleteModal('Category', category.id)}
            >
              x
            </Button>
          </td>
        </tr>
        <SubCategoryList
          subcategories={category.bucket}
          showDeleteModal={props.showDeleteModal}
        />
      </Fragment>
    );
  });
  return categoryList;
}

function SubCategoryList(props) {
  const subcategoryList = props.subcategories.map((subcategory) => {
    return (
      <tr key={subcategory.id}>
        <td>{subcategory.name}</td>
        <td>
          <Button
            variant="outline-danger"
            onClick={() => props.showDeleteModal('Subcategory', subcategory.id)}
          >
            x
          </Button>
        </td>
      </tr>
    );
  });
  return subcategoryList;
}

function Group(props) {
  return (
    <div>
      <p>Create new category</p>
      <form onSubmit={props.onGroupSubmit}>
        <label>
          Category Name:
          <input
            name="newGroup"
            value={props.newGroup}
            onChange={props.onGroupChange}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
    </div>
  );
}

function Bucket(props) {
  return (
    <div>
      <p>Create Subcategory</p>
      <form onSubmit={props.onBucketSubmit}>
        <label>
          Subcategory name
          <input
            name="name"
            value={props.newBucket.name}
            onChange={props.onBucketChange}
          />
        </label>
        <label>
          Parent Category
          <select
            name="parent"
            value={props.newBucket.id}
            onChange={props.onBucketChange}
          >
            {props.categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </label>
        <input type="submit" value="submit" />
      </form>
    </div>
  );
}
