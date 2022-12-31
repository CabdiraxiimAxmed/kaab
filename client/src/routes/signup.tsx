import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
type Data = {
  name: string;
  username: string;
  email: string;
  password: string;
};
const signup: React.FC = () => {
  const [data, setData] = useState<Data>({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name: string = e.target.name;
    let value: string = e.target.value;
    setData({ ...data, [name]: value });
  };
  const handleClick = () => {
    if (!data.name || !data.username || !data.email || !data.password) {
      toast('fadlan buuxi xogta');
      return;
    }
    if (data.password.length < 6) {
      toast('passwordka wuu yaryahay');
      return;
    }
    axios
      .post('api/users/signup', data)
      .then(resp => {
        if (resp.data == 'success') {
          toast('waa lagu guuleystay');
        } else if (resp.data === 'account-exist') {
          toast('account exist');
        } else if (resp.data == 'error') {
          toast('qalad ayaa dhacay');
        }
      })
      .catch(err => {
        console.log('error happened');
        console.log(err.message);
      });
  };
  return (
    <div className="singup-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="inner-container">
        <h1 className="form-title">Singup</h1>
        <input
          className="form-input"
          placeholder="magaca"
          name="name"
          onChange={handleChange}
        />
        <input
          className="form-input"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="pasword"
          name="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button className="form-submit-button" onClick={handleClick}>
          submit
        </button>
      </div>
    </div>
  );
};

export default signup;
