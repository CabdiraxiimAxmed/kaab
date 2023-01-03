import React, { useEffect, useState } from 'react';
import QuestionText from '../Components/QuestionText';
import Editor from '../Components/Editor';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Result from '../Components/Result';

type ProblemType = {
  language: string;
  file: string;
  code: string;
  readMe: string;
  srcPath: string;
  folder: string;
};
const Problem: React.FC = () => {
  const [problem, setProblem] = useState<ProblemType>({
    language: '',
    file: '',
    code: '',
    readMe: '',
    srcPath: '',
    folder: '',
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
        {problem.code && <Editor code={problem.code} file={problem.file} />}
        <Result />
      </div>
    </>
  );
};

export default Problem;
