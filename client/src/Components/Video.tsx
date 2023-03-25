import React, { useRef, useState, useEffect, useContext } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaVideo } from 'react-icons/fa';
import { FaClipboard } from 'react-icons/fa';
import { SocketContext, Value } from '../app/Socket';

const Video: React.FC = () => {
  const [myId, setMyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const { socket, myStream, userStream ,  callUser, call, callAccepted, answerCall } = useContext(SocketContext) as Value;
  const showNotification = call.isReceivingCall && !callAccepted;
  let myVideo: any = useRef();
  let userVideo: any = useRef();
  useEffect(() => {
    socket.emit("request-id", '');
    socket.on('me', (id: string) => {
      setMyId(id);
    })
  }, [socket])

  if(myVideo!.current) {
    myVideo.current.srcObject = myStream;
  }

  useEffect(() => {
    if(userVideo!.current && userStream) {
      userVideo.current.srcObject = userStream;
    }
  }, [userVideo, userStream])

  return (
    <>
      {showNotification && 
        <div className='call-notification'>
          <button onClick={answerCall} style={{backgroundColor: 'blue', color: "white",}}>{call.name} is calling...</button>
        </div>
      }
      <div className='video-chat-container'>
        <div className='video-wrapper'>
          <div className='video-inner-wrapper'>
            <div className='video-tools-container'>
              <video className='user-video' width='240px' ref={myVideo} autoPlay playsInline controls={false} />
              <button className='video-btn'><FaVideo /></button>
            </div>
            {userStream && <video className='user-video' width='240px' ref={userVideo} autoPlay playsInline controls={false} />}
          </div>
        </div>
        <div className='call-copy-btn-container'>
          <div id='user-id-input'>
            <input onChange={(e) => setUserId(e.target.value)} />
          </div>
          <button onClick={() => navigator.clipboard.writeText(myId)}> <FaClipboard /> copy id </button>
          <button onClick={() => callUser(userId, myId)}> <FaPhoneAlt/> call </button>
        </div>
      </div>
    </>
  );
}

export default Video;
