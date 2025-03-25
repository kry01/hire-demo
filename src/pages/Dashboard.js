import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService, profileService, publicationService } from '../services/mockApi';
import { formatDate, timeAgo, isRecent } from '../utils/dateUtils';
import { handleApiError } from '../utils/errorUtils';

// Composant pour les statistiques
const StatsGrid = ({ stats, getProjectProfiles }) => (
  <div className="stats-grid">
    <div className="stats-card">
      <div className="stats-icon primary">
        <span className="material-icons">folder</span>
      </div>
      <div className="stats-content">
        <div className="stats-value">{stats.totalProjects}</div>
        <div className="stats-label">Projets</div>
        {stats.totalProjects > 0 && (
          <div className="stats-progress progress-up">
            <span className="material-icons progress-icon">arrow_upward</span>
            <span className="progress-value">Nouvelle activité</span>
          </div>
        )}
      </div>
    </div>
    
    <div className="stats-card accent">
      <div className="stats-icon accent">
        <span className="material-icons">person</span>
      </div>
      <div className="stats-content">
        <div className="stats-value">{stats.totalProfiles}</div>
        <div className="stats-label">Profils</div>
        {stats.totalProfiles > 0 && (
          <div className="stats-progress progress-up">
            <span className="material-icons progress-icon">arrow_upward</span>
            <span className="progress-value">Récemment actif</span>
          </div>
        )}
      </div>
    </div>
    
    <div className="stats-card success">
      <div className="stats-icon success">
        <span className="material-icons">publish</span>
      </div>
      <div className="stats-content">
        <div className="stats-value">{stats.totalPublications}</div>
        <div className="stats-label">Publications</div>
        {stats.totalPublications === 0 && (
          <Link to="/publications/new" className="stats-link">
            Publier une annonce
          </Link>
        )}
      </div>
    </div>
    
    <div className="stats-card warning">
      <div className="stats-icon warning">
        <span className="material-icons">group</span>
      </div>
      <div className="stats-content">
        <div className="stats-value">0</div>
        <div className="stats-label">Candidats</div>
        <Link to="/candidates/import" className="stats-link">
          Importer des CV
        </Link>
      </div>
    </div>
  </div>
);

// Composant pour l'onglet des projets récents
const ProjectsTab = ({ projects, getProjectProfiles }) => (
  <div className="tab-panel">
    <div className="section-header">
      <h2 className="section-title">Projets récents</h2>
      <Link to="/" className="btn-link">Voir tous les projets</Link>
    </div>
    
    {projects.length === 0 ? (
      <div className="empty-state-container">
        <div className="empty-state-card">
          <div className="empty-state-illustration">
            <div className="illustration-circle"></div>
            <span className="material-icons illustration-icon">folder_open</span>
          </div>
          <h2 className="empty-state-title">Aucun projet trouvé</h2>
          <p className="empty-state-description">
            Vous n'avez pas encore créé de projet. Les projets vous permettent d'organiser vos recrutements et de suivre leur progression.
          </p>
          <div className="empty-state-actions">
            <Link to="/projects/new" className="btn btn-primary btn-lg">
              <span className="material-icons btn-icon">add</span>
              Créer un Projet
            </Link>
            <button className="btn btn-outline empty-state-help">
              <span className="material-icons btn-icon">help_outline</span>
              Guide de démarrage
            </button>
          </div>
          <div className="empty-state-tips">
            <div className="tip-item">
              <span className="material-icons tip-icon">lightbulb</span>
              <span className="tip-text">Créez un projet pour chaque besoin de recrutement</span>
            </div>
            <div className="tip-item">
              <span className="material-icons tip-icon">group</span>
              <span className="tip-text">Ajoutez des profils dans chaque projet</span>
            </div>
            <div className="tip-item">
              <span className="material-icons tip-icon">publish</span>
              <span className="tip-text">Publiez vos annonces sur différentes plateformes</span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="card project-card">
            <div className="card-header">
              <h3 className="card-title">{project.title}</h3>
              <span className="badge badge-primary">{project.status}</span>
            </div>
            <div className="project-body">
              <p className="project-description">{project.description}</p>
              
              <div className="project-meta">
                <div className="meta-item">
                  <span className="material-icons meta-icon">business</span>
                  <span>{project.department}</span>
                </div>
                <div className="meta-item">
                  <span className="material-icons meta-icon">calendar_today</span>
                  <span>{formatDate(project.creationDate)}</span>
                </div>
              </div>
              
              {project.manager && (
                <div className="project-meta">
                  <div className="meta-item">
                    <span className="material-icons meta-icon">person</span>
                    <span>
                      {project.managers && project.managers.length > 0 
                        ? `Responsable${project.managers.length > 1 ? 's' : ''}: ${project.managers.join(', ')}` 
                        : `Responsable: ${project.manager}`}
                    </span>
                  </div>
                  {project.startDate && project.endDate && (
                    <div className="meta-item">
                      <span className="material-icons meta-icon">date_range</span>
                      <span>Période: {formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${Math.min(getProjectProfiles(project.id).length * 20, 100)}%` }}></div>
              </div>
              <div className="progress-info">
                <span className="progress-label">Progression</span>
                <span className="progress-value">{Math.min(getProjectProfiles(project.id).length * 20, 100)}%</span>
              </div>
              
              <h4 className="profile-section-title">
                <span className="material-icons">person</span>
                Profils ({getProjectProfiles(project.id).length})
              </h4>
              
              {getProjectProfiles(project.id).length === 0 ? (
                <p className="no-profiles">Aucun profil créé pour ce projet.</p>
              ) : (
                <div className="profiles-list">
                  {getProjectProfiles(project.id).map(profile => (
                    <div key={profile.id} className="profile-item">
                      <div className="profile-info">
                        <span className="profile-title">{profile.title}</span>
                      </div>
                      <Link to={`/profiles/${profile.id}`} className="btn btn-primary btn-sm">
                        Voir
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer">
              <Link to={`/profiles/new?projectId=${project.id}`} className="btn btn-primary btn-sm">
                <span className="material-icons btn-icon">add</span>
                Ajouter un profil
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Composant pour l'onglet des activités récentes
const ActivitiesTab = ({ projects, profiles, publications }) => (
  <div className="tab-panel">
    <div className="section-header">
      <h2 className="section-title">Activités récentes</h2>
    </div>
    
    <div className="activities-timeline">
      {/* Activités générées dynamiquement basées sur les données */}
      <div className="activity-item">
        <div className="activity-icon">
          <span className="material-icons">folder</span>
        </div>
        <div className="activity-content">
          <div className="activity-header">
            <h4 className="activity-title">Nouveau projet créé</h4>
            <span className="activity-time">{projects[0]?.creationDate ? timeAgo(projects[0].creationDate) : 'Aujourd\'hui'}</span>
          </div>
          <p className="activity-description">
            Vous avez créé le projet "{projects[0]?.title || 'Projet de recrutement'}".
          </p>
        </div>
      </div>
      
      {profiles.length > 0 && (
        <div className="activity-item">
          <div className="activity-icon">
            <span className="material-icons">person</span>
          </div>
          <div className="activity-content">
            <div className="activity-header">
              <h4 className="activity-title">Nouveau profil ajouté</h4>
              <span className="activity-time">{profiles[0]?.creationDate ? timeAgo(profiles[0].creationDate) : 'Aujourd\'hui'}</span>
            </div>
            <p className="activity-description">
              Vous avez ajouté le profil "{profiles[0]?.title || 'Profil'}" au projet "{
                projects.find(p => p.id === profiles[0]?.projectId)?.title || 'Projet'
              }".
            </p>
          </div>
        </div>
      )}
      
      {publications.length > 0 && (
        <div className="activity-item">
          <div className="activity-icon">
            <span className="material-icons">publish</span>
          </div>
          <div className="activity-content">
            <div className="activity-header">
              <h4 className="activity-title">Annonce publiée</h4>
              <span className="activity-time">{publications[0]?.creationDate ? timeAgo(publications[0].creationDate) : 'Aujourd\'hui'}</span>
            </div>
            <p className="activity-description">
              Vous avez publié l'annonce "{publications[0]?.title || 'Annonce'}" sur {publications[0]?.platform || 'LinkedIn'}.
            </p>
          </div>
        </div>
      )}
      
      {/* Activité fictive pour montrer le design */}
      <div className="activity-item">
        <div className="activity-icon">
          <span className="material-icons">sync</span>
        </div>
        <div className="activity-content">
          <div className="activity-header">
            <h4 className="activity-title">Mise à jour du système</h4>
            <span className="activity-time">Hier</span>
          </div>
          <p className="activity-description">
            Le système a été mis à jour avec de nouvelles fonctionnalités.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour l'onglet d'accès rapide
const QuickAccessTab = () => (
  <div className="tab-panel">
    <div className="section-header">
      <h2 className="section-title">Accès rapide</h2>
    </div>
    
    <div className="quick-access-grid">
      <Link to="/projects/new" className="quick-access-card">
        <div className="quick-access-icon">
          <span className="material-icons">add_circle</span>
        </div>
        <div className="quick-access-content">
          <h3 className="quick-access-title">Nouveau projet</h3>
          <p className="quick-access-description">Créer un nouveau projet de recrutement</p>
        </div>
      </Link>
      
      <Link to="/publications" className="quick-access-card">
        <div className="quick-access-icon">
          <span className="material-icons">publish</span>
        </div>
        <div className="quick-access-content">
          <h3 className="quick-access-title">Publications</h3>
          <p className="quick-access-description">Voir toutes les offres publiées</p>
        </div>
      </Link>
      
      <Link to="/candidates/import" className="quick-access-card">
        <div className="quick-access-icon">
          <span className="material-icons">upload_file</span>
        </div>
        <div className="quick-access-content">
          <h3 className="quick-access-title">Importer des CV</h3>
          <p className="quick-access-description">Ajouter de nouveaux candidats</p>
        </div>
      </Link>
      
      <Link to="/profiles/new" className="quick-access-card">
        <div className="quick-access-icon">
          <span className="material-icons">person_add</span>
        </div>
        <div className="quick-access-content">
          <h3 className="quick-access-title">Nouveau profil</h3>
          <p className="quick-access-description">Créer un nouveau profil pour un projet</p>
        </div>
      </Link>
    </div>
  </div>
);

// Composant principal Dashboard
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Charger toutes les données en parallèle
        const [projectsData, profilesData, publicationsData] = await Promise.all([
          projectService.getProjects(),
          profileService.getProfiles(),
          publicationService.getPublications()
        ]);

        setProjects(projectsData);
        setProfiles(profilesData);
        setPublications(publicationsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Fonction pour obtenir les profils d'un projet avec mémorisation
  const getProjectProfiles = React.useCallback((projectId) => {
    return profiles.filter(profile => profile.projectId === projectId);
  }, [profiles]);

  // Calculer les statistiques avec mémorisation
  const stats = React.useMemo(() => ({
    totalProjects: projects.length,
    totalProfiles: profiles.length,
    totalPublications: publications.length,
    recentProjects: projects.slice(0, 3)
  }), [projects, profiles, publications]);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <span className="material-icons error-icon">error_outline</span>
        <h3 className="error-title">Erreur</h3>
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          <span className="material-icons btn-icon">refresh</span>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-welcome">
        <div className="welcome-content text-center">
          <h1 className="welcome-title">Bonjour, Recruteur</h1>
          <p className="welcome-subtitle">Bienvenue dans votre espace SmartHire</p>
        </div>
        <div className="welcome-action-center">
          <Link to="/projects/new" className="btn btn-primary btn-lg">
            <span className="material-icons btn-icon">add</span>
            Nouveau Projet
          </Link>
        </div>
      </div>
      
      <StatsGrid stats={stats} getProjectProfiles={getProjectProfiles} />
      
      <div className="dashboard-tabs">
        <button 
          className={`dashboard-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <span className="material-icons">folder</span>
          Projets récents
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          <span className="material-icons">history</span>
          Activités récentes
        </button>
        <button 
          className={`dashboard-tab ${activeTab === 'quick' ? 'active' : ''}`}
          onClick={() => setActiveTab('quick')}
        >
          <span className="material-icons">flash_on</span>
          Accès rapide
        </button>
      </div>
      
      <div className="dashboard-tab-content">
        {activeTab === 'projects' && (
          <ProjectsTab 
            projects={stats.recentProjects} 
            getProjectProfiles={getProjectProfiles} 
          />
        )}
        
        {activeTab === 'activities' && (
          <ActivitiesTab 
            projects={projects} 
            profiles={profiles} 
            publications={publications} 
          />
        )}
        
        {activeTab === 'quick' && <QuickAccessTab />}
      </div>
    </>
  );
};

export default Dashboard;