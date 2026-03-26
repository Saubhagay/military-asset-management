import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import Transfers from './components/Transfers';
import Assignments from './components/Assignments';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const base = localStorage.getItem('base');
    const username = localStorage.getItem('username');

    if (token) {
      setUser({ token, role, base, username });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <div className="main-content">
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/purchases" element={user ? <Purchases user={user} /> : <Navigate to="/login" />} />
            <Route path="/transfers" element={user ? <Transfers user={user} /> : <Navigate to="/login" />} />
            <Route path="/assignments" element={user ? <Assignments user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
