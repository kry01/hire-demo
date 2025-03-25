import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicationService, profileService, projectService } from '../services/mockApi';

const PublicationsList = () => {
  const [publications, setPublications] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft'

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les publications
        const publicationsData = await publicationService.getPublications();
        setPublications(publicationsData);
        
        // Charger les profils liés aux publications
        const profileIds = [...new Set(publicationsData.map(pub => pub.profileId))];
        const profilesData = await Promise.all(
          profileIds.map(id => profileService.getProfileById(id))
        );
        
        const profilesMap = {};
        profilesData.forEach(profile => {
          if (profile) profilesMap[profile.id] = profile;
        });
        setProfiles(profilesMap);
        
        // Charger les projets liés aux profils
        const projectIds = [...new Set(profilesData.map(profile => profile?.projectId).filter(Boolean))];
        const projectsData = await Promise.all(
          projectIds.map(id => projectService.getProjectById(id))
        );
        
        const projectsMap = {};
        projectsData.forEach(project => {
          if (project) projectsMap[project.id] = project;
        });
        setProjects(projectsMap);
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filtrer les publications selon le statut
  const filteredPublications = filter === 'all' 
    ? publications 
    : publications.filter(pub => pub.status === filter);
  
  // Récupérer le profil lié à une publication
  const getProfile = (profileId) => {
    return profiles[profileId] || null;
  };
  
  // Récupérer le projet lié à un profil
  const getProject = (profileId) => {
    const profile = getProfile(profileId);
    return profile && profile.projectId ? projects[profile.projectId] : null;
  };
  
  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-header">
        <h1 className="page-title">Publications</h1>
      </div>
      
      <div className="section-header">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button 
            className={`filter-tab ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Publiées
          </button>
          <button 
            className={`filter-tab ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            Brouillons
          </button>
        </div>
      </div>
      
      {filteredPublications.length === 0 ? (
        <div className="empty-state">
          <span className="material-icons empty-icon">description</span>
          <h3 className="empty-title">Aucune publication trouvée</h3>
          <p className="empty-message">
            Vous n'avez pas encore publié d'annonces ou il n'y a pas de publications correspondant au filtre sélectionné.
          </p>
          <Link to="/" className="btn btn-primary">
            <span className="material-icons btn-icon">arrow_back</span>
            Retour au tableau de bord
          </Link>
        </div>
      ) : (
        <div className="publications-grid">
          {filteredPublications.map(publication => {
            const profile = getProfile(publication.profileId);
            const project = getProject(publication.profileId);
            
            return (
              <div key={publication.id} className="card publication-card">
                <div className="card-header">
                  <h3 className="card-title">{publication.title}</h3>
                  <span className={`badge badge-${publication.status === 'published' ? 'success' : 'gray'}`}>
                    {publication.status === 'published' ? 'Publiée' : 'Brouillon'}
                  </span>
                </div>
                <div className="card-body">
                  <div className="publication-meta">
                    <div className="meta-item">
                      <span className="material-icons meta-icon">business</span>
                      <span>Plateforme: {publication.platform}</span>
                    </div>
                    {project && (
                      <div className="meta-item">
                        <span className="material-icons meta-icon">folder</span>
                        <span>Projet: {project.title}</span>
                      </div>
                    )}
                    <div className="meta-item">
                      <span className="material-icons meta-icon">calendar_today</span>
                      <span>Créée le: {new Date(publication.creationDate).toLocaleDateString()}</span>
                    </div>
                    {publication.publishDate && (
                      <div className="meta-item">
                        <span className="material-icons meta-icon">publish</span>
                        <span>Publiée le: {new Date(publication.publishDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="publication-preview">
                    <p className="preview-text">
                      {publication.content.length > 200 
                        ? publication.content.substring(0, 200) + '...' 
                        : publication.content}
                    </p>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-secondary btn-sm">
                    <span className="material-icons btn-icon">visibility</span>
                    Voir
                  </button>
                  {publication.status !== 'published' && (
                    <button className="btn btn-primary btn-sm">
                      <span className="material-icons btn-icon">publish</span>
                      Publier
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default PublicationsList;