import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content-wrapper">
        <Header />
        <main className="main-content">
          <div className="content-container">
            {children}
          </div>
        </main>
        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} SmartHire. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;