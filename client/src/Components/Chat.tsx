import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { FaPaperPlane } from 'react-icons/fa';
import { SocketContext, Value } from '../app/Socket';

let chats = [
  { username: 'abdi', message: 'Hello' },
  { username: 'faarah', message: 'Hi' },
  { username: 'abdi', message: 'How you doing folks?' },
  { username: 'Ali', message: 'No problem.' },
  { username: 'faarah', message: 'Where were you?' },
]
const Chat:React.FC = () => {
  const { socket } = useContext(SocketContext) as Value;
  const user = useSelector((state: RootState) => state.user.value);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }
  return (
    <div className='chat-container'>
      <div className='chat-display'>
        {chats.map((chat, index: number) => (
          <div key={index} className={`chat-message`}>
            <div className= {`${chat.username===user.username ? 'right' : 'left'}`}>
              <p className='sender'> { chat.username} </p>
              <p> {chat.message} </p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className='chat-input-container'>
        <input />
        <button className='send-chat-button'> <FaPaperPlane /> </button>
      </form>
    </div>
  );
};

export default Chat;
