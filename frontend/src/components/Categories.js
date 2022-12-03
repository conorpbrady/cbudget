import React, { useEffect, useState, Fragment } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { useGetCategories } from '../hooks/useGetCategories';
import {
  submitNewGroup,
  submitNewBucket,
  submitDeleteCategory,
} from '../api/categoryApi';
import ConfirmationModal from './ConfirmationModal';
import { useDeleteModal } from '../hooks/useDeleteModal';

export default function Categories() {
  const initBucket = { name: '', parent: firstCategoryId };

  const [newBucket, setNewBucket] = useState(initBucket);
  const [newGroup, setNewGroup] = useState('');

  const [fetchToggle, setFetchToggle] = useState(false);
  const { categories, firstCategoryId } = useGetCategories(fetchToggle);

  const {
    resultMessage,
    resultType,
    clearResult,
    displayConfirmationModal,
    modalChildren,
  } = useDeleteModal(submitDeleteCategory, () => setFetchToggle(!fetchToggle));

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
    submitNewGroup(newGroup);
    setNewGroup('');
    setFetchToggle(!fetchToggle);
  };

  const handleBucketChange = (event) => {
    setNewBucket({ ...newBucket, [event.target.name]: event.target.value });
  };

  const handleBucketSubmit = (event) => {
    event.preventDefault();
    submitNewBucket(newBucket);
    setNewBucket(initBucket);
    setFetchToggle(!fetchToggle);
  };

  return (
    <div>
      {resultMessage && (
        <Alert variant={resultType} onClose={clearResult} dismissible>
          {resultMessage}
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
      <ConfirmationModal {...modalChildren} />
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
            <a
              href="#"
              onClick={() => props.showDeleteModal('Category', category.id)}
            >
              x
            </a>
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
          <a
            href="#"
            onClick={() => props.showDeleteModal('Subcategory', subcategory.id)}
          >
            x
          </a>
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
