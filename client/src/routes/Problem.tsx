import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
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

type ProblemType = {
  file: string;
  code: string;
  srcPath: string;
  language: string;
  folder: string;
  question: string;
  id: number;

}

type UserJoined = {
  username: string;
  roomId: string;
  users: { username: string, socketId: string }[];
}

const Problem: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const [userLanguage, setUserLanguage] = useState<string>('javascript');
  const [roomId, setRoomId] = useState<string>();
  const [socketUsers, setSocketUsers] = useState<SocketUsers[]>();
  const [isShared, setIshared] = useState<boolean>(false);
  const { socket } = useContext(SocketContext) as Value;
  const [ problem, setProblem] = useState<ProblemType>()

  const { id } = useParams();
  useEffect(() => {
    if(user.default_language) {
      axios
        .get(`/api/questions/find/${id}/${user.default_language}`)
        .then(resp => {
          if (resp.data == 'error') {
            toast.error('SERVER: qalad ayaa dhacay');
          } else if (resp.data == 'question-not-exist') {
            toast.error('su,aasha lama helin');
          } else {
            setProblem(resp.data);
            setUserLanguage(user.default_language);
          }
        })
        .catch(err => {
          toast.error(err.message);
        });
    }
  }, [user]);


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
      if (problem?.code) {
        let codeData = { language: problem, question: problem.question, id: problem.id }
        socket.emit('shareCodeData', { roomId, codeData });
      }
    });
  }, [socket, problem]);

  const handleLanguageChange = (language: string): void => {
    axios.get(`/api/questions/find/${id}/${language}`)
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("server error");
          return;
        }
        setProblem(resp.data)
        setUserLanguage(language);
      }) .catch(error => {
        toast.error(error.message);
      })
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
        {problem?.question && <QuestionText questionText={problem.question} />}
        {problem?.code && (
          <div className='editor-container'>
            <div className='editor-header-container'>
              <div className="dropdown">
                <button className="dropBtn">
                  luuqadaha
                </button>
                <div className="dropdown-content">
                  <button className='language-change-button' onClick={() => handleLanguageChange('javascript')}> <FaJsSquare /> Javascript </button>
                  <button className='language-change-button' onClick={() => handleLanguageChange('typescript')}> <FaPython /> Typescript </button>
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
export type {  ProblemType, SocketUsers };
