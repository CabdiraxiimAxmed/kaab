import React, { useEffect, useState } from 'react';
import { FaJsSquare } from 'react-icons/fa';
import io from 'socket.io-client';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import CodeEditor from '@monaco-editor/react';

interface Props {
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

  const user = useSelector((state: RootState) => state.user.value);
  useEffect(() => {
  }, []);
  function handleEditorChange(value, event) {
  }

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
        onChange={handleEditorChange}
      />
      <div className="editor-btns-container">
        <button className="test">Test</button>
      </div>
    </div>
  );
};

export default Editor;
