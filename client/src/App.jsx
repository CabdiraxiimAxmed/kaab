import Singup from './routes/signup';
import Login from './routes/login';
import Home from './routes/Home';
import Header from './routes/Header';
import Problem from './routes/Problem';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
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
