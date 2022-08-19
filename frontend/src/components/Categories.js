import React, { useEffect, useState, Fragment } from 'react';
import axiosInstance from '../api/axiosApi';
import {
  useGetCategories,
  useGetFirstCategory,
} from '../hooks/useGetCategories';
import { submitNewGroup, submitNewBucket } from '../api/categoryApi';

export default function Categories() {
  const { categories, firstCategoryId } = useGetCategories();
  const initBucket = { name: '', parent: firstCategoryId };

  const [newBucket, setNewBucket] = useState(initBucket);
  const [newGroup, setNewGroup] = useState('');

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
      <table>
        <thead>
          <tr>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <CategoryList categories={categories} />
        </tbody>
      </table>
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
        </tr>
        <SubCategoryList subcategories={category.bucket} />
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
