import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaUserAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value); 

  return (
    <>
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
      <div className="header">
        <a href="#" className="logo">
          kaab
        </a>
        <div className="menu">
          <span>
            <FaUserAlt />
          </span>
          <a href="#"> {user.username}</a>
        </div>
      </div>
    </>
  );
};

export default Header;
