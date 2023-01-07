import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { SocketContext, Value } from '../app/Socket';

const Result: React.FC = () => {
  const { socket } = useContext(SocketContext) as Value;
  const [codeResult, setCodeResult] = useState<
    { result: string; time: string }[]
  >([
    {
      result: '',
      time: '',
    },
  ]);

  useEffect(() => {
    socket.on('codeResult', (result: string) => {
      let time = moment().format('hh:mm:ss');
      let socketCodeResult = { result, time };
      setCodeResult([...codeResult, socketCodeResult]);
    });
  }, [socket, codeResult]);

  const clearResult = () => {
    setCodeResult([{ result: '', time: '' }]);
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <p>Natiijada</p>
        <button onClick={clearResult} className="result-clear-button">
          Tir
        </button>
      </div>
      {codeResult.map((result: any, index: number) => (
        <div className="code-results-container">
          <p className="code-result-display">{result.result}</p>
          <p className="result-time-display">{result.time}</p>
        </div>
      ))}
    </div>
  );
};

export default Result;
