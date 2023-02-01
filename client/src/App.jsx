import { useEffect } from 'react';
import Singup from './routes/signup';
import Login from './routes/login';
import PageNotFound from './routes/PageNotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './routes/Home';
import Header from './routes/Header';
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
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/singup" element={<Singup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/problem/:id" element={<Problem />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
