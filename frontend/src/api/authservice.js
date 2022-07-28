import React from "react";
import axiosInstance from "./axiosApi";
import jwt_decode from "jwt-decode";

const refresh = localStorage.getItem("refresh_token");
/*
const verifyTokenRequest = axiosInstance.post('/api/token/verify', {token: refresh})
                            .then(response => { return response; })
                            .catch(error => { console.log(error); });
*/
const getUser = () => {
  if(refresh === null) {
    return {user_id: null, username: null, display_name: null};
  }
  const json = jwt_decode(refresh);
  return json;
}


const authenticate = async () => {
  if(refresh === null) {
    return false;
  }
  try {
    const response = await axiosInstance.post('/api/token/verify', {token: refresh})
    if(response.status === 200){
      return true;
    }
    else {
      return false;
    }
  }
  catch (error) {
    return false;
  }
};

const logout = async () => {

  try {

    const response = await axiosInstance.post('/api/blacklist', {token: refresh})

    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    axiosInstance.defaults.headers['Authorization'] = null;
    window.location.href = "/";
  }
  catch (err) {
    console.log(err);
  
  }
}
export { authenticate, getUser, logout }; 

