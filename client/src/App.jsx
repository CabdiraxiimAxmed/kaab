import { useEffect } from 'react';
import Singup from './routes/signup';
import Login from './routes/login';
import Home from './routes/Home';
import Header from './routes/Header';
import { setSocket } from './features/socket';
import { useDispatch } from 'react-redux';
import Problem from './routes/Problem';
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    let socket = io('http://localhost:2321/', {
      transports: ['websocket'],
    });
    socket.on('message', message => {
      if (message === 'connected') {
        dispatch(setSocket(socket));
      }
    });
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/singup" element={<Singup />} />
        <Route path="/singin" element={<Login />} />
        <Route path="/problem/:id" element={<Problem />} />
      </Routes>
    </Router>
  );
}

export default App;
