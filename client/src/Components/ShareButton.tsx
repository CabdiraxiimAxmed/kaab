import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import VideoChat from '../Components/Video';
import { FaUserAlt } from 'react-icons/fa';
import axios from 'axios';
import { SocketContext, Value } from '../app/Socket';
import { toast } from 'react-toastify';

type SocketUsers = {
  username: string;
  socketId: string
}

interface Probs {
  displayShareButton: boolean;
  socketUsers?: SocketUsers[]
} 

const ShareButton: React.FC<Probs> = ({ displayShareButton, socketUsers }) => {
  const [isShared, setIsShared] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user.value);
  const [displayVideoChat, setDisplayVideoChat] = useState<boolean>(false);
  const { socket } = useContext(SocketContext) as Value;


  const handleShare = ():void => {
    axios.post('/api/rooms/', {roomId: user.username})
      .then(resp => {
        if (resp.data === 'error') {
          toast.error('server error');
          return;
        }
        setIsShared(true);
        socket.emit('share', {roomId: user.username, username: user.username });
    }) .catch(error => {
        toast.error(error.message);
      });
  };

  // Makes the current user as first one in the array
  var first = user.username;
  if(socketUsers)
    socketUsers.sort(function(x,y){ return x.username == first ? -1 : y.username == first ? 1 : 0; });

  return (
    <div className='shared-container'>
      {displayShareButton && <button disabled={isShared} onClick={handleShare}>Baahi</button>}
      {displayShareButton && <button onClick={() => setDisplayVideoChat(!displayVideoChat)}> Enterview </button>}
      <div className='shared-users-container'>
        {socketUsers && socketUsers.map((socketUser: SocketUsers, index: number) => (
          <p key={index}> <FaUserAlt /> {socketUser.username === user.username ? 'Ani' : socketUser.username } </p>
        ))}
      </div>
      {displayVideoChat && <VideoChat />}
    </div>
  );
};

export default ShareButton
