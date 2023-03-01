import React, { useEffect, useState, useContext } from 'react';
import { SocketContext, Value } from '../app/Socket';
import { StartingTime, EndingTime } from '../routes/Competition';
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
  startingTime?: StartingTime;
  isCompetition: boolean;
  competitionId?: number;
  roomId?: string;
  isShared?: boolean;
}

const Editor: React.FC<Props> = ({ preWrittenCode, file, folder, id, language, startingTime, isCompetition, competitionId, roomId, isShared }) => {
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

    socket.on('shareCodeText', (value: string) => {
      handleEditorChange(value, false)
    });
  }, [socket, language])

  function handleEditorChange(value = '', share: boolean) {
    if (isShared && share) {
      socket.emit('shareCodeText', {roomId, value });
      return;
    }
    setCode(value);
  }
  const runCode = () => {
    if (language === 'javascript')
      socket.emit('runJavascriptCode', { code, file, folder, language, username: user.username });
    else if (language === 'python')
      socket.emit('runPythonCode', { code, file, folder, language, username: user.username });
    else if (language === 'typescript')
      socket.emit('runJavascriptCode', { code, file, folder, language, username: user.username });
  };
  const testCode = () => {
    if (language === 'javascript')
      socket.emit('testJavascriptCode', { questionId: id, code, file, folder, language, username: user.username, isCompetition, startingTime, competitionId });
    else if (language === 'typescript')
      socket.emit('testJavascriptCode', { questionId: id, code, file, folder, language, username: user.username, isCompetition, startingTime, competitionId });
    else if (language === 'python')
      socket.emit('testPythonCode', { questionId: id, code, file, folder, language, username: user.username, isCompetition, startingTime, competitionId });
  };

  return (
    <>
      <Codemirror
        value={code}
        height='90vh'
        theme='light'
        extensions={extensions}
        onChange={(value: string, viewUpdate: any) => {
          let length: number = viewUpdate.changes.inserted[1]?.text.length;
          if (length === undefined) handleEditorChange(value, false)
          else handleEditorChange(value, true)
        }}
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
