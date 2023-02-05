import React, { useContext, useState, useEffect } from 'react';
import { RootState } from '../app/store';
import { toast } from 'react-toastify';
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
const Result: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const { socket } = useContext(SocketContext) as Value;
  const [codeResult, setCodeResult] = useState<CodeResultType>({
    result: '',
    time: '',
  });
  const [displayCodeResult, setDisplayCodeResult] = useState<boolean>(false);
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
      setDisplayJavascriptFailedMessage(false);
      setCodeResult(socketCodeResult);
    });
    socket.on('passed', ({ questionId }: {questionId: number}) => {
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
        setDisplayCodeResult(false);
        setDisplayJavascriptFailedMessage(true);
        setJavascriptFailedMessage(result);
      }
    );
  }, [socket, codeResult, javascriptFailedMessage]);

  return (
    <div className="result-container">
      {displayCodeResult && <CodeResult result={codeResult} />}
      {displayJavascriptFailedMessage && (
        <JavascriptFailedMessage messages={javascriptFailedMessage} />
      )}
    </div>
  );
};

interface CodeResultProps {
  result: { result: string; time: string };
}
const CodeResult: React.FC<CodeResultProps> = ({ result }) => {
  const [codeResult, setCodeResult] = useState<CodeResultType[]>([
    {
      result: '',
      time: '',
    },
  ]);

  useEffect(() => {
    setCodeResult([...codeResult, result]);
  }, [result]);

  const clearResult = () => {
    setCodeResult([{ result: '', time: '' }]);
  };
  return (
    <>
      <div className="result-header">
        <p>Natiijada</p>
        <button onClick={clearResult} className="result-clear-button">
          Tir
        </button>
      </div>
      {codeResult.map((result: any, index: number) => (
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
