import { createContext, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Peer from 'simple-peer'
import io from 'socket.io-client';

interface Props {
  children: React.ReactNode;
}

interface Value {
  socket: any;
  myStream: any;
  userStream: any;
  callUser: (id: string, myId: string) => void;
  answerCall: () => void;
  call: any;
  callAccepted: any;
}

const SocketContext = createContext<Value | null>(null);
const Context: React.FC<Props> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.value);
  const [myStream, setMyStream] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [call, setCall] = useState<any>({});
  const [userStream, setUserStream] = useState<any>(null);
  const [isAudioAvailable, setIsAudioAvailable] = useState<boolean>(true)
  const [isVideoAvailable, setIsVideoAvailable] = useState<boolean>(true)
  let socket = io('http://localhost:2321/', {
    transports: ['websocket'],
  });

  const connectionRef: any = useRef();

  useEffect(() => {
    socket.on("callUser", ({ from, name, signal }) => {
      setCall({ isReceivingCall: true, from, signal, name });
    });
  }, [socket])

  useEffect(() => {
    setMyStream(null);
    if (isAudioAvailable || isVideoAvailable) {
      navigator.mediaDevices
        .getUserMedia({ video: isVideoAvailable, audio: isAudioAvailable })
        .then(currentStream => {
          if (isVideoAvailable) {
            setMyStream(currentStream);
          };
        })
        .catch(err => {
          console.error("error:", err);
        });
    }
    if (!isVideoAvailable) {
      myStream?.getVideoTracks()[0].stop();
    }
  }, [isAudioAvailable, isVideoAvailable])

  const callUser = (id: string, myId: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream: myStream });
    peer.on('signal', (data: any) => {
      socket.emit("callUser", { userToCall: id, from: myId, signalData: data, name: user.username })
    })

    peer.on('stream', (currentStream: any) => {
      setUserStream(currentStream);
    });
    socket.on('callAccepted', (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    })
    connectionRef.current = peer;
  }

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: myStream });
    peer.on('signal', (data: any) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    })
    peer.on('stream', (currentStream: any) => {
      setUserStream(currentStream);
    });
    peer.signal(call.signal);
    connectionRef.current = peer;

  }

  return (
    <SocketContext.Provider value={{
      socket,
      myStream,
      userStream,
      callUser,
      call,
      callAccepted,
      answerCall,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export type { Value };
export { SocketContext, Context };
