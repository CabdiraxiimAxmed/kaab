import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Problem: React.FC = () => {
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`/api/questions/find/${id}`)
      .then(resp => {
        if (resp.data == 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
        } else if (resp.data == 'question-not-exist') {
          toast.error('su,aasha lama helin');
        } else {
          console.log(resp.data);
        }
      })
      .catch(err => {
        toast.error(err.message);
      });
  }, []);
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
      <h1 style={{ color: 'white' }}>Hello world</h1>
    </>
  );
};

export default Problem;
