import React, { useState, useEffect, useContext } from 'react';
import { SocketContext, Value } from '../app/Socket';
import { FaJsSquare } from 'react-icons/fa';
import { FaPython } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Result from '../Components/Result'
import Editor from '../Components/Editor'
import QuestionText from '../Components/QuestionText'
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

type SharedProblemType = {
  language: { code: string; file: string; folder: string; language: string; srcPath: string};
  question: string;
  id: number;
}
const Shared: React.FC = () => {
  const { username } = useSelector((state: RootState) => state.user.value);
  const [problem, setProblem] = useState<SharedProblemType>({
    language: { code: '', file: '', folder: '', language: '', srcPath: '' },
    question: '',
    id: 0,
  });
  const { socket } = useContext(SocketContext) as Value;
  const { roomId } = useParams();

  useEffect(() => {
    if(username) {
      let data = {roomId, username };
      socket.emit('share', data);
      socket.on('joined', (users: any) => {
        // do some stuff.
      })
    }
    socket.on('codeData', (codeData: SharedProblemType) => {
      console.log('This is the final one');
      setProblem(codeData);
    })
  }, [username]);

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
        {problem.language.code && (
          <div className='editor-container'>
            <div className='editor-header-container' style={{ flexDirection: "row" }}>
              <div className="file-name-container">
                {problem.language.file === 'sum.js' ? <FaJsSquare className="file-icon" /> : <FaPython className='file-icon' />} {problem.language.file}
              </div>
            </div>
            <Editor
              preWrittenCode={problem.language.code}
              file={problem.language.file}
              folder={problem.language.folder}
              language={problem.language.language}
              id={problem.id}
            />
          </div>
        )}
        <Result displayShareButton={false} />
      </div>

    </>
  );
};

export default Shared;
