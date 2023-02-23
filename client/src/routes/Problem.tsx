import React, { useEffect, useState, useContext } from 'react';
import QuestionText from '../Components/QuestionText';
import { FaJsSquare } from 'react-icons/fa';
import { FaPython } from 'react-icons/fa';
import Editor from '../Components/Editor';
import { SocketContext, Value } from '../app/Socket';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatResult from '../Components/ChatResult';

type SocketUsers = {
  username: string;
  socketId: string
}

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

const SUPPORTED_LANGUAGES = ['javascript', 'python'];
const Problem: React.FC = () => {
  const [userLanguage, setUserLanguage] = useState<string>('javascript');
  const [roomId, setRoomId] = useState<string>();
  const [socketUsers, setSocketUsers] = useState<SocketUsers[]>();
  const [isShared, setIshared] = useState<boolean>(false);
  const { socket } = useContext(SocketContext) as Value;
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

  const getDefaultCodeLanguage = (languages: Languages[], term: string) => languages.find((language: Languages) => language?.language === term);
  let userDefaultLanguage: Languages= getDefaultCodeLanguage(problem.languages, userLanguage) || problem.languages[0];

  const isSupported = ():{javascript: boolean; python: boolean} => {
    let result = {javascript: false, python: false};
    for(let language of SUPPORTED_LANGUAGES) {
      let isSupported: Languages | undefined = getDefaultCodeLanguage(problem.languages, language);
      if(isSupported) {
        result = {...result, [language]: true};
      } else {
        result = {...result, [language]: false};
      }
    }
    return result;
  };

  useEffect(() => {
    socket.on('users', (users: {users: SocketUsers[]}) => {
      setSocketUsers(users.users);
    })
    socket.on('user-left', (username: string) => {
      toast.warn(`${username} wuu baxay!!!`)
    })
    socket.on('new-user', (username: string) => {
      toast.success(`${username} wuu yimid!!!`)
    })
    socket.on('user-joined', (data: UserJoined) => {
      let { username, roomId, users } = data;
      // TODO: if the other one works delete this one.
      setRoomId(roomId);
      setIshared(true);
      if (userDefaultLanguage?.code) {
        let codeData = { language: userDefaultLanguage, question: problem.question, id: problem.id }
        socket.emit('shareCodeData', { roomId, codeData });
      }
    });
  }, [socket, userDefaultLanguage]);

  const handleLanguageChange = (language: string): void => {
    setUserLanguage(language);
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
                  <button
                    disabled={!isSupported().javascript} className='language-change-button' onClick={() => handleLanguageChange('javascript')}> <FaJsSquare /> Javascript </button>
                  <button disabled={!isSupported().python} className='language-change-button' onClick={() => handleLanguageChange('python')}> <FaPython /> Python </button>
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
        <ChatResult socketUsers={socketUsers} roomId={roomId} />
      </div>
    </>
  );
};


export default Problem;
export type { ProblemType, Languages, SocketUsers };
