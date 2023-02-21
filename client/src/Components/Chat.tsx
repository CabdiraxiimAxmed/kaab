import React, { useEffect, useState, useContext } from 'react';
import { ThreeDots } from  'react-loader-spinner'
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
  const [userTyping, setUserTyping] = useState<{isTyping: boolean; username: string}>({isTyping: false, username: ''});
  const [otherChatText, setOtherChatText] = useState<ChatType[]>([ { username: '', chat: '' }, ]);
  const user = useSelector((state: RootState) => state.user.value);

  useEffect(() => {
    setOtherChatText(chatMessages);
    socket.on('typing', (data: { isTyping: boolean; username: string }) => {
      if (data.isTyping) {
        console.log(`${data.username} is typing.`)
      } else {
        console.log(`${data.username} is not typing.`)
      }
    })
    socket.on('typing', (data: {isTyping: boolean; username: string}) => {
      setUserTyping(data);
    });
  }, [chatMessages, socket])

  const handleFocus =  (isFocused: boolean) => {
    if(isFocused) {
      socket.emit('typing', {isTyping: true, username: user.username, roomId });
      return;
    }
    socket.emit('typing', {isTyping: false, username: user.username, roomId });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(chatText) {
      let data = { username: user.username, chat: chatText };
      let chatMessages = [...otherChatText, data];
      setOtherChatText([...otherChatText, data]);
      socket.emit('typing', {isTyping: false, username: user.username, roomId });
      socket.emit('chatText', { roomId, chatMessages });
      setChatText('');
    }
  }
  return (
    <div className='chat-container'>
      <div onClick={() => handleFocus(false) } className='chat-display'>
        <div className='chat-box'>
          {otherChatText.slice(1).map((chat, index: number) => (
            <div key={index} className={`chat-message`}>
              <div className={`${chat.username === user.username ? 'right' : 'left'}`}>
                <p className='sender'> {chat.username === user.username ? 'Ani' : chat.username } </p>
                <p> {chat.chat} </p>
              </div>
            </div>
          ))}
          {userTyping.isTyping && 
          <div className='chat-message'>
            <div className='left'>
              <p className='sender'>{userTyping.username}</p>
              <p> <ThreeDots height='12' color='white' width='52' /> </p>
            </div>
          </div>
          }
        </div>
      </div>
      <form onSubmit={handleSubmit} className='chat-input-container'>
        <input
          onFocus={() => handleFocus(true) }
          value={chatText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatText(e.target.value)}
        />
        <button className='send-chat-button'> <FaPaperPlane /> </button>
      </form>
    </div>
  );
};

export default Chat;
