import Singup from './routes/signup';
import Login from './routes/login';
import Home from './routes/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/singup" element={<Singup />} />
        <Route path="/singin" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
