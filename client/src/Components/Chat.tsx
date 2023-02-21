import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { FaPaperPlane } from 'react-icons/fa';
import { SocketContext, Value } from '../app/Socket';

type ChatType = {
  username: string;
  chat: string
}
interface Props {
  roomId?: string;
  chatMessages: {username: string; chat: string}[];
}
const Chat: React.FC<Props> = ({ roomId, chatMessages }) => {
  const { socket } = useContext(SocketContext) as Value;
  const [chatText, setChatText] = useState<string>('');
  const [otherChatText, setOtherChatText] = useState<ChatType[]>([{ username: '', chat: '' }]);
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    setOtherChatText(chatMessages);
  }, [chatMessages])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(chatText) {
      let data = { username: user.username, chat: chatText };
      let chatMessages = [...otherChatText, data];
      setOtherChatText([...otherChatText, data]);
      socket.emit('chatText', { roomId, chatMessages });
      setChatText('');
    }
  }
  return (
    <div className='chat-container'>
      <div className='chat-display'>
        <div className='chat-box'>
          {otherChatText.slice(1).map((chat, index: number) => (
            <div key={index} className={`chat-message`}>
              <div className={`${chat.username === user.username ? 'right' : 'left'}`}>
                <p className='sender'> {chat.username} </p>
                <p> {chat.chat} </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className='chat-input-container'>
        <input value={chatText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatText(e.target.value)} />
        <button className='send-chat-button'> <FaPaperPlane /> </button>
      </form>
    </div>
  );
};

export default Chat;
