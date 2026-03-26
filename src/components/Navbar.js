import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Asset Management ({user.role})</h2>
      </div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        {(user.role === 'Admin' || user.role === 'Logistics Officer') && (
          <Link to="/purchases">Purchases</Link>
        )}
        <Link to="/transfers">Transfers</Link>
        <Link to="/assignments">Assignments</Link>
        <button className="action-btn" onClick={onLogout} style={{width: 'auto', marginLeft: '20px', padding: '5px 10px'}}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
