import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import  { setUser } from '../features/user';
import { toast } from 'react-toastify';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UserAccount: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  let dispatch = useDispatch();
  const [userData, setUserData] = useState<{[key: string]: string}>(user);

  const handleClick =(): void => {
    if(!userData.name || !userData.username || !userData.email) {
      toast.warn('Fadlan xogta dhameestir');
      return;
    }
    let oldUsername:string = user.username
    axios.post('/api/users/update', {...userData, oldUsername})
      .then(resp => {
        if (resp.data === 'error') {
          toast.error('server error');
          return;
        } else if (resp.data === 'username-exist') {
          toast.warn('username horey loo qaatay');
          return;
        }
        dispatch(setUser(userData));
        toast.success('success');
      }).catch(error => {
        toast.error(error.message);
      });
  }

  const handleChange =(e: React.ChangeEvent<HTMLInputElement>): void => {
    let name = e.target.name;
    let value = e.target.value;
    setUserData((prevData: {[key: string]: string}) => {
      return {...prevData, [name]: value};
    });
  }

  return (
    <>
      <div className='user-profile-account-container'>
        <div className='input-container'>
          <label>Magaca*</label>
          <input
            className="form-input"
            placeholder="Magaca"
            defaultValue={user.name}
            name="name"
            onChange={handleChange}
          />
        </div>
        <div className='input-container'>
          <label>username</label>
          <input
            className="form-input"
            placeholder="username*"
            defaultValue={user.username}
            name="username"
            onChange={handleChange}
          />
        </div>
        <div className='input-container'>
          <label>Email*</label>
          <input
            className="form-input"
            placeholder="Email*"
            defaultValue={user.email}
            name="email"
            onChange={handleChange}
          />
        </div>
        <button style={{ cursor: 'pointer' }} className='change-password'>Furaha Badal</button>
      </div>
      <button onClick={handleClick} className='submit-button'>Submit</button>
    </>
  );
}

export default UserAccount;
