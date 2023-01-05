import React, { useEffect, useState, useContext } from 'react';
import { SocketContext, Value } from '../app/Socket';
import { FaJsSquare } from 'react-icons/fa';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import CodeEditor from '@monaco-editor/react';

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
  const user = useSelector((state: RootState) => state.user.value);
  useEffect(() => {
    setCode(preWrittenCode);
  }, [preWrittenCode]);
  function handleEditorChange(value = '', event: any) {
    setCode(value);
  }
  const runCode = () => {
    let username = 'abdi';
    let language = 'javascript';
    socket.emit('runCode', { code, file, folder, language, username });
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="file-name-container">
          <FaJsSquare className="file-icon" /> {file}
        </div>
      </div>
      <CodeEditor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={code}
        theme="light"
        onChange={(value, event) => handleEditorChange(value, event)}
      />
      <div className="editor-btns-container">
        <button className="run" onClick={runCode}>
          Run
        </button>
        <button className="test">Test</button>
      </div>
    </div>
  );
};

export default Editor;
