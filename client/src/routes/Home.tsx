import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Question = {
  id: number;
  name: string;
  folder: string;
  file: string;
  level: string;
};
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 0,
      name: '',
      folder: '',
      file: '',
      level: '',
    },
  ]);
  useEffect(() => {
    axios
      .get('api/questions')
      .then(resp => {
        if (resp.data == 'error') {
          toast.error('SERVER: qalad ayaa dhacay');
        } else {
          setQuestions(resp.data);
        }
      })
      .catch(err => {
        toast.error(err.message);
      });
  }, []);

  const handleClick = (id: number) => {
    navigate(`/problems/${id}`);
  };

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
      <div className="question-links-container">
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>magaca</th>
              <th>heerka</th>
            </tr>
          </thead>
          {questions.map((question: Question, index: number) => (
            <tbody onClick={() => handleClick(question.id)}>
              <tr>
                <td>{question.id}</td>
                <td>{question.name}</td>
                <td>{question.level}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
};

export default Home;
