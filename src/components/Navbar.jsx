// components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUser();

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/library', label: 'Library', icon: '🎮' },
    { path: '/store', label: 'Store', icon: '🛒' },
    { path: '/community', label: 'Community', icon: '👥' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎮</span>
          <span className="logo-text">GameHub</span>
        </Link>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile">
                <img 
                  src={user.avatar || 'https://via.placeholder.com/40'} 
                  alt={user.username}
                  className="user-avatar"
                />
                <span className="user-name">{user.username}</span>
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary">Sign In</button>
          )}
        </div>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;