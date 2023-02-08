import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/user';
import axios from 'axios';

const ProtectedRoute: React.FC = () => {
  console.log("inside protetced route");
  const dispatch = useDispatch();
  let [cookies] = useCookies();
  let location = useLocation();
  let isAuth = () => {
    if(cookies.login) {
      axios.get(`/api/users/find/${cookies.login}`)
        .then(resp =>  {
          if (resp.data === 'error') {
            return;
          }
          dispatch(setUser(resp.data));
        }).catch(error => {
          // TODO: handle the error.
        })
      return true;
    }
    return false;
  }

  return isAuth() ? (
    <Outlet />
  ) : (
      <Navigate to="/signin" state={{ from: location }} />
    );

};

export default ProtectedRoute;
