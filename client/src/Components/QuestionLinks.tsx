import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../routes/Home';

interface Props {
  questions: Question[];
}
const QuestionLinks: React.FC<Props> = ({ questions }) => {
  const navigate = useNavigate();
  const handleClick = (id: number) => {
    navigate(`/problem/${id}`);
  };

  return (
    <div className="question-links-container">
      <h2 style={{ marginTop: '10px' }}>Su,aalaha</h2>
      {questions.map((question: Question, index: number) => (
        <div
          key={index}
          onClick={() => handleClick(question.id)}
          className="question-links-innner-container"
        >
          <div className="question-link-container">
            <h4 style={{ display: 'inline', marginRight: '20px' }}>
              {question.id}. {question.name}
            </h4>
            <span className="easy-counter-container">{question.level}</span>
            <div className="question-preview-description-container">
              <p>{question.question}</p>
            </div>
            <div className="question-preview-description-cover"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionLinks;
