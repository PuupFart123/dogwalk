import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Trophy, User, PawPrint } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('dogwalk_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <PawPrint className="logo-icon" />
          <span className="logo-text">DogWalk</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/upload" className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}>
            <Upload size={20} />
            <span>Upload</span>
          </Link>
          <Link to="/winners" className={`nav-link ${location.pathname === '/winners' ? 'active' : ''}`}>
            <Trophy size={20} />
            <span>Winners</span>
          </Link>
        </nav>

        <div className="user-section">
          {user ? (
            <Link to={`/profile/${user.username}`} className="profile-link">
              <User size={20} />
              <span>Profile</span>
            </Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link login-link">
                Sign In
              </Link>
              <Link to="/signup" className="auth-link signup-link">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 