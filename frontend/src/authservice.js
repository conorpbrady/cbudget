import React from "react";
import axiosInstance from "./axiosApi";

const refresh = localStorage.getItem("refresh_token");
const loggedIn = axiosInstance.post('/api/token/verify', {token: refresh})
                .then(response => {
                 return Promise.resolve(response.status === 200);
                })
                .catch(error => {
                  console.log(error);
                });
export default loggedIn; 

