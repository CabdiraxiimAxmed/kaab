import React, { useState, useEffect, } from 'react';
import RemainingCountDown from './RemainingCountDown';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { FaJsSquare } from 'react-icons/fa';
import { FaPython } from 'react-icons/fa';
import QuestionText from './QuestionText';
import Editor from './Editor';
import Result from './Result';
import { toast } from 'react-toastify';
import { ProblemType } from '../routes/Problem';
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
  const user = useSelector((state: RootState ) => state.user.value);
  const [ userLanguage, setUserLanguage ] = useState<string>(user.username);
  const [problem, setProblem] = useState<ProblemType>();

  useEffect(() => {
    if(question_id && user.default_language){
      axios.get(`/api/questions/find/${question_id}/${user.default_language}`)
        .then(resp => {
          if (resp.data === 'error') {
            toast.error('Server Error');
            return;
          }
          setProblem(resp.data);
          setUserLanguage(user.default_language);
        }) .catch(error => {
          toast.error(error.message);
        })
    }
  }, [])
  const handleLanguageChange = (language: string): void => {
    axios.get(`/api/questions/find/${question_id}/${language}`)
      .then(resp => {
        if (resp.data === 'error') {
          toast.error('Server Error');
          return;
        }
        setProblem(resp.data);
        setUserLanguage(language);
      }) .catch(error => {
        toast.error(error.message);
      })
  }

  return (
    <div className='competition-page-container'>
      {endingTime && <RemainingCountDown endingTime={endingTime} />}
      <div className="question-editor-result-container">
        {problem?.question && <QuestionText questionText={problem.question} />}
        {problem?.code && (
          <div className='editor-container'>
            <div className='editor-header-container'>
              <div className="dropdown"> <button className="dropBtn">
                  luuqadaha
                </button>
                <div className="dropdown-content">
                  <button className='language-change-button' onClick = {() => handleLanguageChange('javascript')}> <FaJsSquare /> Javascript </button>
                  <button className='language-change-button' onClick={() => handleLanguageChange('python')}> <FaPython /> Python </button>
                </div>
              </div>
              <div className="file-name-container">
                {problem.file === 'sum.js' ? <FaJsSquare className="file-icon" /> : <FaPython className='file-icon' />} {problem.file}
              </div>
            </div>
            <Editor
              preWrittenCode={problem.code}
              file={problem.file}
              folder={problem.folder}
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
