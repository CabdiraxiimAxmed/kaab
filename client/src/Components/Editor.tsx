import React from 'react';
import { FaJsSquare } from 'react-icons/fa';
import CodeEditor from '@monaco-editor/react';

interface Props {
  code: string;
  file: string;
}
const Editor: React.FC<Props> = ({ code, file }) => {
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
