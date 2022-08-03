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
    this.setState({
      [event.target.name]: event.target.value
    }
    );
  }

  handleSubmit(event) {
    event.preventDefault
  }

 render() {
   return (
    <p>Main groups here</p>
   );
 }
}

class Bucket extends Component {
  
  constructor(props) {
    super(props);

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
      <p>Bucket stuff here</p>
    );
  }
}


export default Categories;
     
