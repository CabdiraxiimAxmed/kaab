import React, { useState, useEffect, } from 'react';
import RemainingCountDown from './RemainingCountDown';
import { FaJsSquare } from 'react-icons/fa';
import { FaPython } from 'react-icons/fa';
import QuestionText from './QuestionText';
import Editor from './Editor';
import Result from './Result';
import { toast } from 'react-toastify';
import { ProblemType, Languages } from '../routes/Problem';
import { StartingTime, EndingTime } from '../routes/Competition';
import axios from 'axios';

interface Props {
  startingTime?: StartingTime,
  endingTime?: EndingTime,
  question_id?: number;
  competitionId?: number;
}
/* time took to complete */
const CompetitionPage: React.FC<Props> = ({ startingTime, endingTime, question_id, competitionId }) => {
  const [ userLanguage, setUserLanguage] = useState<string>('javascript');
  const [problem, setProblem] = useState<ProblemType>({
    languages: [{ file: '', code: '', srcPath: '', language: '', folder: '' }],
    question: '',
    id: 0,
  });

  useEffect(() => {
    if(question_id){
      axios.get(`/api/questions/find/${question_id}`)
        .then(resp => {
          if (resp.data === 'error') {
            toast.error('Server Error');
            return;
          }
          setProblem(resp.data);
        }) .catch(error => {
          toast.error(error.message);
        })
    }
  }, [])
  const getDefaultCodeLanguage = (languages: Languages[]) => languages.find((language: Languages) => language.language === userLanguage);

  let userDefaultLanguage: Languages | undefined = getDefaultCodeLanguage(problem.languages);

  const handleLanguageChange = (language: string): void => {
    setUserLanguage(language);
  }

  return (
    <div className='competition-page-container'>
      {endingTime && <RemainingCountDown endingTime={endingTime} />}
      <div className="question-editor-result-container">
        {problem.question && <QuestionText questionText={problem.question} />}
        {userDefaultLanguage?.code && (
          <div className='editor-container'>
            <div className='editor-header-container'>
              <div className="dropdown">
                <button className="dropBtn">
                  luuqadaha
                </button>
                <div className="dropdown-content">
                  <button className='language-change-button' onClick = {() => handleLanguageChange('javascript')}> <FaJsSquare /> Javascript </button>
                  <button className='language-change-button' onClick={() => handleLanguageChange('python')}> <FaPython /> Python </button>
                </div>
              </div>
              <div className="file-name-container">
                {userDefaultLanguage.file === 'sum.js' ? <FaJsSquare className="file-icon" /> : <FaPython className='file-icon' />} {userDefaultLanguage.file}
              </div>
            </div>
            <Editor
              preWrittenCode={userDefaultLanguage.code}
              file={userDefaultLanguage.file}
              folder={userDefaultLanguage.folder}
              id={problem.id}
              language={userLanguage}
              startingTime={startingTime}
              competitionId={competitionId}
              isCompetition={true}
            />
          </div>
        )}
        <Result displayShareButton={false} />
      </div>
    </div>
  );
}

export default CompetitionPage;
