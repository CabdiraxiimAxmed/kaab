import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import QuestionLinks from '../Components/QuestionLinks';
import { useNavigate } from 'react-router-dom';
type Question = {
  id: number;
  name: string;
  folder: string;
  file: string;
  level: string;
  question: string;
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
      question: '',
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
    navigate(`/problem/${id}`);
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
      {questions.length >= 1 && <CountQuestionLevels questions={questions} />}
      {questions.length >= 1 && <QuestionLinks questions={questions} />}
      <div className="question-links-container"></div>
    </>
  );
};

interface CountQuestionLevelsProb {
  questions: Question[];
}
const CountQuestionLevels: React.FC<CountQuestionLevelsProb> = ({
  questions,
}) => {
  let easy: number = questions.filter(
    (question: Question) => question.level == 'fudeed'
  ).length;
  let medium: number = questions.filter(
    (question: Question) => question.level == 'dhexaad'
  ).length;
  let hard: number = questions.filter(
    (question: Question) => question.level == 'adeeg'
  ).length;
  return (
    <div className="question-levels-counter-container">
      <h2>Tirada heerarka</h2>
      <span className="easy-counter-container">{easy} fudeed</span>
      <span className="medium-counter-container">{medium} dhexaad</span>
      <span className="hard-counter-container">{hard} adeeg</span>
    </div>
  );
};

export default Home;
export type { Question };
