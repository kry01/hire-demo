import React, { useState } from 'react';

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };
  
  return (
    <header className="app-header">
      <div className="header-search">
        <span className="material-icons search-icon">search</span>
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="search-input"
        />
      </div>
      
      <div className="header-actions">
        <button className="action-btn" onClick={toggleNotifications}>
          <span className="material-icons">notifications</span>
          <span className="notification-badge">2</span>
        </button>
        
        <div className="user-profile" onClick={toggleUserMenu}>
          <div className="avatar">
            <span className="avatar-text">RH</span>
          </div>
          <div className="user-info">
            <span className="user-name">Recruteur</span>
            <span className="user-role">Admin</span>
          </div>
          <span className="material-icons dropdown-icon">
            {userMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        </div>
        
        {userMenuOpen && (
          <div className="user-menu">
            <ul>
              <li>
                <span className="material-icons">person</span>
                <span>Mon profil</span>
              </li>
              <li>
                <span className="material-icons">settings</span>
                <span>Paramètres</span>
              </li>
              <li className="menu-divider"></li>
              <li>
                <span className="material-icons">logout</span>
                <span>Déconnexion</span>
              </li>
            </ul>
          </div>
        )}
        
        {notificationsOpen && (
          <div className="notifications-menu">
            <div className="notifications-header">
              <h3>Notifications</h3>
              <button className="btn-link">Tout marquer comme lu</button>
            </div>
            <ul className="notifications-list">
              <li className="notification-item unread">
                <div className="notification-icon success">
                  <span className="material-icons">check_circle</span>
                </div>
                <div className="notification-content">
                  <p>Offre "Développeur Full-Stack" publiée sur LinkedIn</p>
                  <span className="notification-time">Il y a 10 minutes</span>
                </div>
              </li>
              <li className="notification-item">
                <div className="notification-icon primary">
                  <span className="material-icons">folder</span>
                </div>
                <div className="notification-content">
                  <p>Nouveau projet créé: "Recrutement Développeurs"</p>
                  <span className="notification-time">Hier</span>
                </div>
              </li>
            </ul>
            <div className="notifications-footer">
              <button className="btn-link">Voir toutes les notifications</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;