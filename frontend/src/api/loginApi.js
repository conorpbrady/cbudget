import axiosInstance from './axiosApi';

export const submitLogin = (loginInfo) => {
  let message = '';
  axiosInstance
    .post('/api/token/obtain/', loginInfo)
    .then((response) => {
      axiosInstance.defaults.headers['Authorization'] =
        'JWT ' + response.data.access;
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      message = 'Login Success';
      window.location.href = '/';
    })
    .catch((error) => {
      message = 'Login failed';
    });

  return message;
};

export const submitSignup = (signupInfo) => {
  let message = '';

  axiosInstance
    .post('/api/user/create/', signupInfo)
    .then(() => {
      message = 'Signup Successful';
      window.location.href = '/login';
    })
    .catch((error) => {
      const errorMessages = error.response.data.errors;
      for (let em of errorMessages) {
        message += '[' + em.field + '] ' + em.message + ' ';
      }
    });
};
