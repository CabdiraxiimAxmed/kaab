import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
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
} 

const ShareButton: React.FC<Probs> = ({ displayShareButton }) => {
  const [isShared, setIsShared] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user.value);
  const [socketUsers, setSocketUsers] = useState<SocketUsers[]>();
  const { socket } = useContext(SocketContext) as Value;

  useEffect(() => {
    socket.on('joined', (users: {users: SocketUsers[]}) => {
      setSocketUsers(users.users);
    })
  }, [socket]);

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
      <div className='shared-users-container'>
        {socketUsers && socketUsers.map((socketUser: SocketUsers, index: number) => (
          <p key={index}> <FaUserAlt /> {socketUser.username === user.username ? 'Ani' : socketUser.username } </p>
        ))}
      </div>
    </div>
  );
};

export default ShareButton
