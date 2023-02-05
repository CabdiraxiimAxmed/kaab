import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaCheckSquare } from 'react-icons/fa';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { Question } from '../routes/Home';
import axios from 'axios';

interface Props {
  questions: Question[];
}
const QuestionLinks: React.FC<Props> = ({ questions }) => {
  const navigate = useNavigate();
  const [ answeredQuestionIds, setAnsweredQuestionIds] = useState<number[]>([]);
  let user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    axios.get(`/api/users/answeredQuestions/${user.username}`)
      .then(resp => {
        if (resp.data === 'error') {
          toast.error('SERVER: qalad ayaa dhacay!!');
          return;
        }
        console.log('data');
        setAnsweredQuestionIds(resp.data);
      }).catch(error => {
        toast.error(error.message);
      })
  }, [])

  const handleClick = (id: number) => {
    navigate(`/problem/${id}`);
  };

  const answered = (id: number): boolean => {
    if(answeredQuestionIds.indexOf(id) === -1) return false;
    return true;
  }

  return (
    <div>
      <h2 style={{ marginTop: '10px' }}>Su,aalaha</h2>
      <div className="question-links-inner-container">
        {questions.map((question: Question, index: number) => (
          <div
            className="question-link-container"
            key={index}
            onClick={() => handleClick(question.id)}
          >
            {answered(question.id) && <span className='checked-icon' style={{ marginRight: '10px' }}><FaCheckSquare /></span>}
            <h4 style={{ display: 'inline', marginRight: '20px' }}>
              {index + 1}. {question.name}
            </h4>
            <span className={findLevelClass(question.level)}>
              {question.level}
            </span>
            <div className="question-preview-description-container">
              <p>{question.question}</p>
            </div>
            <div className="question-preview-description-cover"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const findLevelClass = (level: string) => {
  switch (level) {
    case 'fudeed':
      return 'easy-counter-container';
    case 'dhexaad':
      return 'medium-counter-container';
    case 'adeeg':
      return 'hard-counter-container';
  }
};

export default QuestionLinks;
