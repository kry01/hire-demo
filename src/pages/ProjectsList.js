import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService, profileService } from '../services/mockApi';
import { formatDate } from '../utils/dateUtils';
import { handleApiError } from '../utils/errorUtils';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [projectsData, profilesData] = await Promise.all([
          projectService.getProjects(),
          profileService.getProfiles()
        ]);

        setProjects(projectsData);
        setProfiles(profilesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Fonction pour obtenir les profils d'un projet
  const getProjectProfiles = (projectId) => {
    return profiles.filter(profile => profile.projectId === projectId);
  };

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
      <div className="dashboard-header">
        <h1 className="page-title">Tous les projets</h1>
        <Link to="/projects/new" className="btn btn-primary">
          <span className="material-icons btn-icon">add</span>
          Nouveau Projet
        </Link>
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
    </>
  );
};

export default ProjectsList; 