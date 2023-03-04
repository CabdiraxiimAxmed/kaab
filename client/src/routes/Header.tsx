import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value); 

  return (
    <>
      <div className="header">
        <Link to="/home" className="logo">
          kaab
        </Link>
        <div className="menu">
          <div>
            <span>
              <FaUserAlt />
            </span>
            <Link to="/profile"> {user.username}</Link>
          </div>
          <div>
            <span>
              <FaUserFriends />
            </span>
            <Link to='/competition/create'> tartan </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
