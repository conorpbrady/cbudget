import React, { Component, Fragment } from "react";
import axiosInstance from "../api/axiosApi";

class Categories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      group_name: "",
      newBucket: {
        subcat_name: "",
        parent_id: ""
      }
    }

    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleGroupSubmit = this.handleGroupSubmit.bind(this);

    this.handleBucketChange = this.handleBucketChange.bind(this);
    this.handleBucketSubmit = this.handleBucketSubmit.bind(this);

  }

  getCategoryList() {
    // TODO: Make two calls in tandem then merge or have backend return all info in one call
    axiosInstance.get('/api/group')
     .then(response => {
       const groups = response.data;
       axiosInstance.get('/api/bucket')
        .then(response => {
          const buckets = response.data;      
          let categories = []
          let categoryMap = {}

          groups.map( (grp, index) => {
            categoryMap = {...categoryMap, [grp.name]: index}
            categories.push({ 
                name: grp.name,
                tableId: grp.id + "0",
                id: grp.id,
                subcategories: []
              });
          });
          buckets.map( bkt => {
            const key = categoryMap[bkt.parent];
            categories[key].subcategories.push({
              tableId: "" + categories[key].id + bkt.id,
              id: bkt.id,
              name: bkt.name
            });
          });
          if(categories.length) {
            this.setState(prevState => ({
              newBucket: {
                  ...prevState.newBucket,
                  parent_id:`${categories[0].id}`
                }
              }));
            }
          this.setState({ categories });
        })
       .catch(error => { console.log(error) })
     })
     .catch(error => { console.log(error) });
  }

  handleGroupChange(group_name) {
    this.setState({ group_name });
  }

  handleBucketChange(newBucket) {
    this.setState({ newBucket });
  }

  handleGroupSubmit() {
    const newGroup = { name: this.state.group_name }
    axiosInstance.post('/api/group', newGroup)
    .then(response => {
      const group_name = ''
      this.setState({ group_name });
      this.getCategoryList();
    })
    .catch(error => { console.log(error) })
  }

  handleBucketSubmit() {
    const newBucket = {
      name: this.state.newBucket.subcat_name,
      parent: parseInt(this.state.newBucket.parent_id)
    }
    axiosInstance.post('/api/bucket', newBucket)
    .then(response => {
      const emptyBucket = {
        ...newBucket,
        subcat_name: ''
      }
      this.setState({ newBucket: emptyBucket })
      this.getCategoryList();
      }
    )
    .catch(error => { console.log(error) });
  }

  componentDidMount() {
    this.getCategoryList();
  }

  render () {
    return (
      <div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            </tr>
        </thead>
        <tbody>
          <CategoryList categories={this.state.categories} />
        </tbody>
      </table>
      <div>
        <Group
          group_name={this.state.group_name}
          onGroupChange={this.handleGroupChange}
          onGroupSubmit={this.handleGroupSubmit} 
        />
        <Bucket
          categories={this.state.categories}
          newBucket={this.state.newBucket}
          onBucketChange={this.handleBucketChange}
          onBucketSubmit={this.handleBucketSubmit}
        />
      </div>
      </div>
    );
  }
}

class CategoryList extends Component {
  render() {
      const categories = this.props.categories;
      const categoryList = categories.map(category => {
        
        return (
          <Fragment key={category.tableId}>
          <tr key={category.tableId}>
            <td><strong>{category.name}</strong></td>
          </tr>
          <SubCategoryList subcategories={ category.subcategories } />
          </Fragment>
        );
      });
      return categoryList;
  }
}

class SubCategoryList extends Component {
  
  render() {
    const subcategories = this.props.subcategories;
    const subcategoryList = subcategories.map(subcategory => {
      return (
          <tr key={subcategory.tableId}>
            <td>{subcategory.name}</td>
          </tr>
        );
      });
    return subcategoryList;
  }
}

class Group extends Component {
  
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.props.onGroupChange(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onGroupSubmit();
  }

 render() {
   const groupName = this.props.group_name
   return (  
    <div>
      <p>Create new category</p>
      <form onSubmit={this.handleSubmit}>
        <label>Category Name:
          <input name="group_name" value={groupName} onChange={this.handleChange} />
        </label>
        <input type="submit" value="submit" />
      </form>
     </div>
   );
 }
}

class Bucket extends Component {
  
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //TODO: Figure out why this works - read more on setState and optional callback
  handleChange(event) {
    const updatedBucket = {
      ...this.props.newBucket,
      [event.target.name]: event.target.value
    }
    this.props.onBucketChange(updatedBucket);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onBucketSubmit();
  }
  
  render() {
    return (
      <div>
      <p>Create Subcategory</p>
      <form onSubmit={this.handleSubmit}>
      <label>Subcategory name
      <input name="subcat_name" value={this.props.newBucket.subcat_name} onChange={this.handleChange} />
      </label>
      <label>Parent Category
      <select name="parent_id" defaultValue={this.props.newBucket.parent_id} onChange={this.handleChange} >
        { 
          this.props.categories.map((category, index) => {
            return (<option value={category.id} key={index}>{category.name}</option>);
          })
        }
      </select>
      </label>
      <input type="submit" value="submit" />
      </form>
      </div>
    );
  }
}

export default Categories;
