import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { toast } from 'react-toastify';

export default function Navbar() {
  const navigate = useNavigate();
  const wallet = localStorage.getItem('wallet');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('wallet');
    localStorage.removeItem('role');
    toast.success('👋 Logged out successfully!',{autoClose:2000});
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
          alt="Book Logo"
          className="logo-icon"
        />
        <span className="logo-text">E-learning</span>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {wallet && role === 'admin' && <Link to="/admin">Admin</Link>}
        {wallet && role === 'instructor' && <Link to="/instructor">Instructor</Link>}
        {wallet && role === 'student' && <Link to="/student">Student</Link>}
        {wallet && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
