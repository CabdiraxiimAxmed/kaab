import React, { useEffect, useState, useContext } from 'react';
import { SocketContext, Value } from '../app/Socket';
import { langs } from '@uiw/codemirror-extensions-langs';
import { FaJsSquare } from 'react-icons/fa';
import { vim } from '@replit/codemirror-vim';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import Codemirror from '@uiw/react-codemirror';

interface Props {
  preWrittenCode: string;
  file: string;
  folder: string;
}

type CodeData = {
  code: string;
  file: string;
  folder: string;
  language: string;
  username: string;
};

const Editor: React.FC<Props> = ({ preWrittenCode, file, folder }) => {
  const { socket } = useContext(SocketContext) as Value;
  const [code, setCode] = useState<string>('');
  const [extensions] = useState<any[]>([
    langs.tsx(),
    vim(),
  ])
  const user = useSelector((state: RootState) => state.user.value);
  useEffect(() => {
    setCode(preWrittenCode);
  }, [preWrittenCode]);
  function handleEditorChange(value = '') {
    setCode(value);
  }
  const runCode = () => {
    let language = 'javascript';
    console.log("run code")
    console.log({ code, file, folder, language, username: user.username });
    socket.emit('runCode', { code, file, folder, language, username: user.username });
  };
  const testCode = () => {
    let language = 'javascript';
    socket.emit('testCode', { code, file, folder, language, username: user.username });
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="file-name-container">
          <FaJsSquare className="file-icon" /> {file}
        </div>
      </div>
      <Codemirror
        value={code}
        height='90vh'
        theme='light'
        extensions={extensions}
        onChange={(value: string, viewUpdate: any) => handleEditorChange(value)}
      />
      <div className="editor-btns-container">
        <button className="run" onClick={runCode}>
          Run
        </button>
        <button onClick={testCode} className="test">
          Test
        </button>
      </div>
    </div>
  );
};

export default Editor;
