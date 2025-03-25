import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>SmartHire</h3>
          <p>Simplifiez votre processus de recrutement</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-links-group">
            <h4>Resources</h4>
            <ul>
              <li><a href="#!">Documentation</a></li>
              <li><a href="#!">Guides</a></li>
              <li><a href="#!">API</a></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4>Entreprise</h4>
            <ul>
              <li><a href="#!">À propos</a></li>
              <li><a href="#!">Contact</a></li>
              <li><a href="#!">Carrières</a></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h4>Support</h4>
            <ul>
              <li><a href="#!">Centre d'aide</a></li>
              <li><a href="#!">Confidentialité</a></li>
              <li><a href="#!">Conditions</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SmartHire. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;