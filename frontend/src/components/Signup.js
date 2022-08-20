import React, { useState, useCallback } from 'react';
import { submitSignup } from '../api/loginApi';

export default function Signup() {
  const initInputs = { username: '', password: '', email: '' };
  const [message, setMessage] = useState('');
  const [inputs, setInputs] = useState(initInputs);

  const handleChange = useCallback(({ target: { name, value } }) =>
    setInputs((prevState) => ({ ...prevState, [name]: value }), [])
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = submitSignup(inputs);
    setMessage(message);
    setInputs(initInputs);
  };
  return (
    <div>
      <div className="warning">{message}</div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            name="username"
            type="text"
            value={inputs.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Password:
          <input
            name="password"
            type="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>

        <label>
          Email:
          <input
            name="email"
            type="text"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
