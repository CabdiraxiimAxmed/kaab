import { useEffect } from 'react';
import Singup from './routes/signup';
import Login from './routes/login';
import Shared from './routes/Shared';
import User from './routes/User';
import PageNotFound from './routes/PageNotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './routes/Home';
import Header from './routes/Header';
import Problem from './routes/Problem';
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  useEffect(() => {
    let socket = io('http://localhost:2321/', {
      transports: ['websocket'],
    });
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/singup" element={<Singup />} />
        <Route path="*" element={<PageNotFound />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/share/:roomId" element={<Shared />} />
          <Route path="/profile" element={<User />} />
          <Route path="/problem/:id" element={<Problem />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
