import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>SmartHire</h1>
        </Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/projects/new" className={location.pathname === '/projects/new' ? 'active' : ''}>
          Nouveau Projet
        </Link>
      </div>
      
      <div className="navbar-user">
        <span className="user-avatar">
          <i className="user-icon">👤</i>
        </span>
      </div>
    </nav>
  );
};

export default Navbar;