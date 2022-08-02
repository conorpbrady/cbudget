import React, { Component } from "react";
import axiosInstance from "../api/axiosApi";

class Categories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: {},
      newGroup: {},
      newBucket: {}
    }
  }

  componentDidMount() {
    // TODO: Make two calls in tandem then merge
    // TODO: Find a better way to create the categories object 
    axiosInstance.get('/api/group')
     .then(response => {
       const groups = response.data;
       axiosInstance.get('/api/bucket')
        .then(response => {
          const buckets = response.data;      
          let categories = {}
          groups.map( grp => {
            categories = {...categories, ...{ 
              [grp.name]: {
                id: grp.id,
                subcategories: []
              }
            }}
          });

          buckets.map( bkt => {
            categories[bkt.parent].subcategories.push({
              id: bkt.id,
              name: bkt.name
            });
          });

          console.log(categories);
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

// TODO: Make this more readable - rework category object structure
class CategoryList extends Component {
  render() {
      const categories = Object.keys(this.props.categories);
      const categoryList = categories.map((category, index) => {
        const trKey = index + "0";
        return (
          <>
          <tr key={index}>
            <td><strong>{category}</strong></td>
          </tr>
          <SubCategoryList parentId={this.props.categories[category].id} subcategories={ this.props.categories[category].subcategories } />
          </>
        );
      });
    
      return categoryList;
  }
}

class SubCategoryList extends Component {
  render() {
    const subcategories = this.props.subcategories;
    
    const subcategoryList = subcategories.map((subcategory, index) => {
        const trKey = this.props.parentId + index + "";
        return (
          <tr key={index}>
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
     
