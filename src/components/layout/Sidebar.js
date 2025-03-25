import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  
  const menuItems = [
    {
      title: 'Tableau de bord',
      icon: 'dashboard',
      path: '/'
    },
    {
      title: 'Projets',
      icon: 'folder',
      path: '/projects',
      subItems: [
        { title: 'Tous les projets', path: '/projects' },
        { title: 'Nouveau projet', path: '/projects/new' }
      ]
    },
    {
      title: 'Profils',
      icon: 'person',
      path: '/profiles',
      subItems: [
        { title: 'Tous les profils', path: '/profiles' },
        { title: 'Nouveau profil', path: '/profiles/new' }
      ]
    },
    {
      title: 'Publications',
      icon: 'publish',
      path: '/publications',
      subItems: [
        { title: 'Toutes les publications', path: '/publications' },
        { title: 'Nouvelle publication', path: '/publications/new' }
      ]
    },
    {
      title: 'Candidats',
      icon: 'group',
      path: '/candidates',
      subItems: [
        { title: 'Tous les candidats', path: '/candidates' },
        { title: 'Importer des CV', path: '/candidates/import' }
      ]
    }
  ];
  
  useEffect(() => {
    // Ouvrir automatiquement le menu parent de la page active au chargement
    menuItems.forEach(item => {
      if (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path)) {
        setOpenMenus(prev => ({
          ...prev,
          [item.path]: true
        }));
      }
    });
  }, [location.pathname]); // Nous retirons menuItems des dépendances car c'est une constante

  
  // Fonction pour basculer l'état d'ouverture d'un menu
  const toggleMenu = (path) => {
    if (collapsed) {
      // Si la sidebar est réduite, nous l'étendons d'abord
      setCollapsed(false);
      // Puis nous ouvrons le menu avec un petit délai
      setTimeout(() => {
        setOpenMenus(prev => ({
          ...prev,
          [path]: !prev[path]
        }));
      }, 100);
    } else {
      // Si la sidebar est déjà étendue, nous basculons simplement l'état du menu
      setOpenMenus(prev => ({
        ...prev,
        [path]: !prev[path]
      }));
    }
  };
  
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo-icon">SH</span>
          {!collapsed && <span className="logo-text">SmartHire</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isActive = location.pathname === item.path || 
                           (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path));
            const isOpen = openMenus[item.path];
            
            return (
              <li key={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                {hasSubItems ? (
                  // Si l'élément a des sous-menus, nous utilisons un bouton pour le clic
                  <div className="nav-link" onClick={() => toggleMenu(item.path)}>
                    <span className="nav-icon material-icons">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="nav-text">{item.title}</span>
                        <span className="dropdown-icon material-icons">
                          {isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  // Si l'élément n'a pas de sous-menus, nous utilisons un lien normal
                  <Link to={item.path} className="nav-link">
                    <span className="nav-icon material-icons">{item.icon}</span>
                    {!collapsed && <span className="nav-text">{item.title}</span>}
                  </Link>
                )}
                
                {/* Affichage des sous-menus si le menu est ouvert */}
                {!collapsed && hasSubItems && (
                  <ul className={`sub-nav-list ${isOpen ? 'open' : ''}`}>
                    {item.subItems.map(subItem => (
                      <li key={subItem.path} className={`sub-nav-item ${location.pathname === subItem.path ? 'active' : ''}`}>
                        <Link to={subItem.path} className="sub-nav-link">
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-footer-content">
            <p className="version">v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;