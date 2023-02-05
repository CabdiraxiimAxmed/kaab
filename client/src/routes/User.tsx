import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import UserAccount from '../Components/UserAccount';
import UserReport from '../Components/UserReport';

const User: React.FC = () => {
  const [userAccount, setUserAccount] = useState<boolean>(true);
  const [userReport, setUserReport] = useState<boolean>(false);

  const displayComponent = (component: string): void => {
    if (component === 'userAccount') {
      setUserAccount(true);
      setUserReport(false);
    } else if (component === 'userReport') {
      setUserAccount(false);
      setUserReport(true);
    }
  }

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
      <div className="user-profile-info-container">
        <div className='user-profile-panel'>
          <button onClick={() => displayComponent('userAccount')}>Account </button>
          <button onClick ={() => displayComponent('userReport')} >Report </button>
        </div>
        <div className='user-profile-content'>
          {userAccount && <UserAccount />}
          {userReport && <UserReport />}
        </div>
      </div>
    </>
  );
}

export default User;
