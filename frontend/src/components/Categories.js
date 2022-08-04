import React, { Component, Fragment } from "react";
import axiosInstance from "../api/axiosApi";

class Categories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      newGroup: {},
      newBucket: {}
    }
  }

  componentDidMount() {
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
          
          this.setState({ categories });
        })
       .catch(error => { console.log(error) })
     })
     .catch(error => { console.log(error) });
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
        <Group />
        <Bucket />
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
    this.state = {
      group_name: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    }
    );
  }

  handleSubmit(event) {
    event.preventDefault
    newGroup = { name: this.state.group_name }
    axiosInstance.post('/api/group/', newGroup)
    .then(response => {
      this.setState({ group_name: ''});
    })
    .catch(error => { console.log(error) });
  }

 render() {
   return (  
    <div>
      <p>Create new category</p>
      <form onSubmit={this.handleSubmit}>
        <label>Category Name:
          <input name="group_name" value={this.state.name} onChange={this.handleChange} />
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
    this.state = {
      name: '',
      parent: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div>
      <p>Create Subcategory</p>
      <form onSubmit={this.handleSubmit}>
      <label>Subcategory name
      <input name="subcat_name" value={this.state.name } onChange={this.handleChange} />
      </label>
      <label>Parent Category
      <select name="parent_name">
        <option value="1">Option</option>
      </select>
      </label>
      <input type="submit" value="submit" />
      </form>
      </div>
    );
  }
}


export default Categories;
     
