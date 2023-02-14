import React, { useEffect, useState, useContext } from 'react';
import QuestionText from '../Components/QuestionText';
import { FaJsSquare } from 'react-icons/fa';
import { FaPython } from 'react-icons/fa';
import Editor from '../Components/Editor';
import { SocketContext, Value } from '../app/Socket';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Result from '../Components/Result';

type Languages = {
  file: string;
  code: string;
  srcPath: string;
  language: string;
  folder: string;

}
type ProblemType = {
  languages: Languages[];
  question: string;
  id: number;
};

type UserJoined = {
  username: string;
  roomId: string;
  users: { username: string, socketId: string }[];
}

const Problem: React.FC = () => {
  const [userLanguage, setUserLanguage] = useState<string>('javascript');
  const [roomId, setRoomId] = useState<string>();
  const [isShared, setIshared] = useState<boolean>(false);
  const { socket } = useContext(SocketContext) as Value;
  const [checked, setChecked] = useState<{ javascript: boolean, python: boolean }>({ javascript: true, python: false });
  const [problem, setProblem] = useState<ProblemType>({
    languages: [{ file: '', code: '', srcPath: '', language: '', folder: '' }],
    question: '',
    id: 0,
  });

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
          setProblem(resp.data);
        }
      })
      .catch(err => {
        toast.error(err.message);
      });
  }, []);

  const getDefaultCodeLanguage = (languages: Languages[]) => languages.find((language: Languages) => language.language === userLanguage);

  let userDefaultLanguage: Languages | undefined = getDefaultCodeLanguage(problem.languages);

  useEffect(() => {
    socket.on('user-joined', (data: UserJoined) => {
      let { username, roomId, users } = data;
      setRoomId(roomId);
      setIshared(true);
      if (userDefaultLanguage?.code) {
        let codeData = { language: userDefaultLanguage, question: problem.question, id: problem.id }
        socket.emit('shareCodeData', { roomId, codeData });
      }
    });
  }, [socket, userDefaultLanguage]);

  const handleLanguageChange = (language: string): void => {
    if (language === 'javascript') {
      setChecked({ javascript: true, python: false });
    } else if (language === 'python') {
      setChecked({ javascript: false, python: true });
    }
    setUserLanguage(language);
  }

  console.log('problem file:', roomId);
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
                  <button className='language-change-button' onClick={() => handleLanguageChange('javascript')}> <FaJsSquare /> Javascript </button>
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
              isCompetition={false}
              roomId={roomId}
              isShared={isShared}
            />
          </div>
        )}
        <Result displayShareButton={true} />
      </div>
    </>
  );
};


export default Problem;
export type { ProblemType, Languages };
