import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
type Data = {
  username: string;
  password: string;
};
const login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState<Data>({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name: string = e.target.name;
    let value: string = e.target.value;
    setData({ ...data, [name]: value });
  };
  const handleClick = () => {
    if (!data.username || !data.password) {
      toast('fadlan buuxi xogta');
      return;
    }

    axios
      .post('api/users/signin', data)
      .then(resp => {
        if (typeof resp.data == 'object') {
          dispatch(setUser(resp.data));
          navigate('/home');
        } else if (resp.data == 'account-not-found') {
          toast.error('cinwaanka ma abuurno');
        } else if (resp.data == 'password-not-matched') {
          toast.error('passwordka waa qalad');
        } else if (resp.data == 'error') {
          toast.error('qalad ayaa dhacay');
        }
      })
      .catch(err => {
        toast.error('qalad ayaa dhacay');
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
        <h1 className="form-title">Singin</h1>
        <input
          className="form-input"
          placeholder="username"
          name="username"
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

export default login;
