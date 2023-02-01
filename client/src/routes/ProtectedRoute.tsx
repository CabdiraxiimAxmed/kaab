import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const ProtectedRoute: React.FC = () => {
  console.log("inside protetced route");
  const user = useSelector((state: RootState) => state.user.value);
  const location = useLocation();
  const isAuth = () => {
    if(user.username) return true;
    return false;
  }
  if(isAuth()) {
    return <Outlet />
  } else {
    return <Navigate to='/signin' state={{ from: location }} />
  }
};

export default ProtectedRoute;
