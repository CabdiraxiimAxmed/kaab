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
    <div>
      <h2 style={{ marginTop: '10px' }}>Su,aalaha</h2>
      <div className="question-links-inner-container">
        {questions.map((question: Question, index: number) => (
          <div
            className="question-link-container"
            key={index}
            onClick={() => handleClick(question.id)}
          >
            <h4 style={{ display: 'inline', marginRight: '20px' }}>
              {question.id}. {question.name}
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
