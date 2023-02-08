import React, { useState, useEffect, useContext } from 'react';
import { SocketContext, Value } from '../app/Socket';
import { ToastContainer, toast } from 'react-toastify';
import Result from '../Components/Result'
import Editor from '../Components/Editor'
import QuestionText from '../Components/QuestionText'
import { ProblemType } from './Problem';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Shared: React.FC = () => {
  const { username } = useSelector((state: RootState) => state.user.value);
  const [problem, setProblem] = useState<ProblemType>({
    language: '',
    file: '',
    code: '',
    readMe: '',
    srcPath: '',
    folder: '',
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
    socket.on('codeData', (problem: ProblemType) => {
      console.log('This is the final one');
      console.log(problem);
      setProblem(problem);
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
        {problem.readMe && <QuestionText questionText={problem.readMe} />}
        {problem.code && (
          <Editor
            preWrittenCode={problem.code}
            file={problem.file}
            folder={problem.folder}
            id={problem.id}
          />
        )}
        <Result displayShareButton={false} />
      </div>

    </>
  );
};

export default Shared;
