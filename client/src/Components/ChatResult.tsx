import React, { useState, useEffect, useContext } from 'react';
import { SocketContext, Value } from '../app/Socket';
import { SocketUsers } from '../routes/Problem';
import Chat from './Chat';
import Result from './Result';

interface Props {
  socketUsers?: SocketUsers[];
  roomId?: string;
}
const ChatResult: React.FC<Props> = ({ socketUsers, roomId }) => {
  const { socket }  = useContext(SocketContext) as Value;
  const [ chatMessages, setChatMessages ] = useState<{username: string; chat: string}[]>([{username: '', chat: ''}]);
  useEffect(() => {
    socket.on('chatText', (data: {username: string; chat: string}[]) => {
      setChatMessages(data);
    });
  }, [socket, chatMessages])

  const [displayChat, setDisplayChat] = useState<boolean>(false);
  return (
    <div className="chat-result-wrapper">
      <div className='chat-result-header'>
        <button className='chat-button' onClick={() => setDisplayChat(true)}> sheeko </button>
        <button className='result-button' onClick={() => setDisplayChat(false)}> Natiijada </button>
      </div>
      <div className='chat-result-container'>
        {displayChat && <Chat roomId={roomId} chatMessages={chatMessages} />}
        {!displayChat && <Result displayShareButton={true} socketUsers={socketUsers} />}
      </div>
    </div>
  );
};

export default ChatResult;
