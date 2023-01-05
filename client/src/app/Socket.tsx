import { createContext } from 'react';
import io from 'socket.io-client';

interface Props {
  children: React.ReactNode;
}

interface Value {
  socket: any;
}

const SocketContext = createContext<Value | null>(null);
let socket = io('http://localhost:2321/', {
  transports: ['websocket'],
});

const Context: React.FC<Props> = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export type { Value };
export { SocketContext, Context };
