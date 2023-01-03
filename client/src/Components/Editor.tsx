import React, { useEffect } from 'react';
import { FaJsSquare } from 'react-icons/fa';
import io from 'socket.io-client';
import CodeEditor from '@monaco-editor/react';

interface Props {
  code: string;
  file: string;
}
const Editor: React.FC<Props> = ({ code, file }) => {
  useEffect(() => {
    let socket = io('http://localhost:2321/', {
      transports: ['websocket'],
    });
    socket.emit('message', 'Hello world');
  }, []);
  function handleEditorChange(value, event) {
    console.log('here is the current model value:', value);
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <FaJsSquare className="file-icon" /> {file}
      </div>
      <CodeEditor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={code}
        theme="light"
        onChange={handleEditorChange}
      />
      <div className="editor-btns-container">
        <button className="run">Run</button>
        <button className="test">Test</button>
      </div>
    </div>
  );
};

export default Editor;
