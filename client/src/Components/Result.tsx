import React, { useContext, useState, useEffect } from 'react';
import { RootState } from '../app/store';
import { toast } from 'react-toastify';
import ShareButton from '../Components/ShareButton';
import { CirclesWithBar } from  'react-loader-spinner'
import { useSelector } from 'react-redux';
import JavascriptFailedMessage from './JavascriptFailedMessage';
import moment from 'moment';
import axios from 'axios';
import { SocketContext, Value } from '../app/Socket';

type JavascriptFailedMessageType = {
  title: string;
  received: string;
  expected: string;
};
type CodeResultType = {
  result: string;
  time: string;
};

interface Probs {
  displayShareButton: boolean;
}

const Result: React.FC<Probs> = ({ displayShareButton }) => {
  const user = useSelector((state: RootState) => state.user.value);
  const { socket } = useContext(SocketContext) as Value;
  const [codeResult, setCodeResult] = useState<CodeResultType[]>([{
    result: '',
    time: '',
  }]);
  const [displayCodeResult, setDisplayCodeResult] = useState<boolean>(false);
  const [displaySpinner, setDisplaySpinner] = useState<boolean>(false);
  const [displayJavascriptFailedMessage, setDisplayJavascriptFailedMessage] =
    useState<boolean>(false);
  const [javascriptFailedMessage, setJavascriptFailedMessage] = useState<
    JavascriptFailedMessageType[]
  >([
    {
      title: '',
      received: '',
      expected: '',
    },
  ]);

  useEffect(() => {
    socket.on('codeResult', (result: string) => {
      let time = moment().format('hh:mm:ss');
      let socketCodeResult = { result, time };
      setDisplayCodeResult(true);
      setDisplaySpinner(false);
      setDisplayJavascriptFailedMessage(false);
      setCodeResult([...codeResult, socketCodeResult]);
      setDisplaySpinner(false);
    });
    socket.on('passed', ({ questionId }: {questionId: number}) => {
      setDisplaySpinner(false);
      axios.post('/api/questions/answered', { username: user.username, questionId })
        .then(resp => {
          if (resp.data === 'error') {
            toast.error('server error');
            return;
          }
          toast.success('question is stored');
        }).catch(error => {
          toast.error(error.message);
        })
    });
    socket.on(
      'javascriptFailedMessage',
      (result: JavascriptFailedMessageType[]) => {
        setDisplaySpinner(false);
        setDisplayCodeResult(false);
        setDisplayJavascriptFailedMessage(true);
        setJavascriptFailedMessage(result);
      }
    );
    socket.on('start-loading', (langauge: string) => {
      setDisplaySpinner(true);
        setDisplayCodeResult(false);
        setDisplayJavascriptFailedMessage(false);
    });
  }, [socket, codeResult, javascriptFailedMessage]);

  const clearResult = () => {
    setCodeResult([{ result: '', time: '' }]);
  };

  return (
    <div className="result-container">
      <div className='display-container'>
        <button onClick={clearResult} className="result-clear-button">
          Tir
        </button>
        {displaySpinner && <div className='spinner-container'>
          <CirclesWithBar
            height="100"
            width="100"
            color="#4d6492"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
          />
        </div>
        }
        {displayCodeResult && <CodeResult result={codeResult} />}
        {displayJavascriptFailedMessage && (
          <JavascriptFailedMessage messages={javascriptFailedMessage} />
        )}
      </div>
      <ShareButton  displayShareButton={displayShareButton}/>
    </div>
  );
};

interface CodeResultProps {
  result: { result: string; time: string }[];
}
const CodeResult: React.FC<CodeResultProps> = ({ result }) => {
  return (
    <>
      <p>Natiijada</p>
      {result.map((result: any, index: number) => (
        <div key={index} className="code-results-container">
          <p className="code-result-display">{result.result}</p>
          <p className="result-time-display">{result.time}</p>
        </div>
      ))}
    </>
  );
};

export default Result;
export type { JavascriptFailedMessageType };
