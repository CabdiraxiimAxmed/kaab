import React, { useContext, useState, useEffect } from 'react';
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
      let socketCodeResult = { result: result, time: '09:18:18' };
      let test = [...codeResult, socketCodeResult];
      console.log({ test });
      setCodeResult(test);
    });
  }, [socket]);

  return (
    <div className="result-container">
      <div className="result-header">
        <p>Natiijada</p>
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
