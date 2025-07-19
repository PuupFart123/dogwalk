import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Trophy, User, PawPrint } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

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
          <Link to="/profile/demo" className="profile-link">
            <User size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 