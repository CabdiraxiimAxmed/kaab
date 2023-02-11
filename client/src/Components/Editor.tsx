import React, { useEffect, useState, useContext } from 'react';
import { SocketContext, Value } from '../app/Socket';
import { StreamLanguage } from '@codemirror/language';
import { langs } from '@uiw/codemirror-extensions-langs';
import { vim } from '@replit/codemirror-vim';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import Codemirror from '@uiw/react-codemirror';

interface Props {
  preWrittenCode: string;
  file: string;
  folder: string;
  id: number;
  language: string;
}

const Editor: React.FC<Props> = ({ preWrittenCode, file, folder, id, language }) => {
  const { socket } = useContext(SocketContext) as Value;
  const [code, setCode] = useState<string>('');
  const [extensions, setExtensions] = useState<any[]>([
    langs.tsx(),
    vim(),
  ])
  const user = useSelector((state: RootState) => state.user.value);
  useEffect(() => {
    setCode(preWrittenCode);
  }, [preWrittenCode]);

  useEffect(() => {
    if(language === 'python') {
      setExtensions([
        langs.python(),
        vim(),
      ])
    } else if (language === 'javascript') {
      setExtensions([
        langs.tsx(),
        vim(),
      ])
    }

    socket.on('code', (value: string) => {
      setCode(value)
    });
  }, [socket, language])

  function handleEditorChange(value = '') {
    // TODO: change this later
    //
    if (true) {
      socket.emit('shareCodeText', {roomId: 1, value });
    }
    setCode(value);
  }
  const runCode = () => {
    if (language === 'javascript')
      socket.emit('runJavascriptCode', { code, file, folder, language, username: user.username });
    else if (language === 'python')
      socket.emit('runPythonCode', { code, file, folder, language, username: user.username });
  };
  const testCode = () => {
    if (language === 'javascript')
      socket.emit('testJavascriptCode', { questionId: id, code, file, folder, language, username: user.username });
    else if (language === 'python')
      socket.emit('testPythonCode', { questionId: id, code, file, folder, language, username: user.username });
  };

  return (
    <>
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
    </>
  );
};

export default Editor;
