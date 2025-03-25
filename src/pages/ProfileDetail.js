import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { profileService, projectService } from '../services/mockApi';

const ProfileDetail = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const profileData = await profileService.getProfileById(parseInt(profileId));
        if (!profileData) {
          setError('Profil non trouvé');
          return;
        }
        
        setProfile(profileData);
        
        if (profileData.projectId) {
          const projectData = await projectService.getProjectById(profileData.projectId);
          setProject(projectData);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [profileId]);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <span className="material-icons empty-icon">error_outline</span>
        <h3 className="empty-title">Erreur</h3>
        <p className="empty-message">{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-header">
        <h1 className="page-title">{profile.title}</h1>
        <div className="section-action">
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            <span className="material-icons btn-icon">arrow_back</span>
            Retour
          </button>
          <Link to={`/publications/new?profileId=${profile.id}`} className="btn btn-primary">
            <span className="material-icons btn-icon">publish</span>
            Générer une annonce
          </Link>
        </div>
      </div>
      
      <div className="profile-detail-card">
        <div className="profile-header">
          {project && (
            <div className="project-meta">
              <div className="meta-item">
                <span className="material-icons meta-icon">folder</span>
                <span>Projet: {project.title}</span>
              </div>
              <div className="meta-item">
                <span className="material-icons meta-icon">business</span>
                <span>Département: {project.department}</span>
              </div>
              <div className="meta-item">
                <span className="material-icons meta-icon">calendar_today</span>
                <span>Créé le: {new Date(profile.creationDate).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-section">
              <h3 className="profile-section-title">
                <span className="material-icons">work</span>
                Détails du poste
              </h3>
              
              <div className="profile-detail-group">
                <div className="profile-detail-label">Type de contrat</div>
                <div className="profile-detail-value">{profile.contractType}</div>
              </div>
              
              <div className="profile-detail-group">
                <div className="profile-detail-label">Lieu</div>
                <div className="profile-detail-value">{profile.location}</div>
              </div>
              
              <div className="profile-detail-group">
                <div className="profile-detail-label">Expérience requise</div>
                <div className="profile-detail-value">{profile.experience} ans</div>
              </div>
            </div>
            
            <div className="profile-section">
              <h3 className="profile-section-title">
                <span className="material-icons">description</span>
                Description
              </h3>
              
              <p className="profile-description">{profile.description}</p>
            </div>
            
            <div className="profile-section">
              <h3 className="profile-section-title">
                <span className="material-icons">psychology</span>
                Compétences
              </h3>
              
              <div className="profile-detail-group">
                <div className="profile-detail-label">Compétences techniques</div>
                <div className="skills-list">
                  {profile.technicalSkills?.split(',').map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.trim()}</span>
                  ))}
                </div>
              </div>
              
              {profile.softSkills && (
                <div className="profile-detail-group">
                  <div className="profile-detail-label">Compétences comportementales</div>
                  <div className="skills-list">
                    {profile.softSkills.split(',').map((skill, index) => (
                      <span key={index} className="skill-tag soft">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.languages && (
                <div className="profile-detail-group">
                  <div className="profile-detail-label">Langues</div>
                  <div className="skills-list">
                    {profile.languages.split(',').map((language, index) => (
                      <span key={index} className="skill-tag language">{language.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="profile-sidebar">
            <div className="profile-section">
              <h3 className="profile-section-title">
                <span className="material-icons">assessment</span>
                Statut du recrutement
              </h3>
              
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '15%' }}></div>
              </div>
              <div className="progress-info">
                <span className="progress-label">Progression</span>
                <span className="progress-value">15%</span>
              </div>
              
              <div className="profile-detail-group" style={{ marginTop: '20px' }}>
                <div className="profile-detail-label">Statut</div>
                <div className="profile-detail-value">
                  <span className="badge badge-primary">En cours</span>
                </div>
              </div>
              
              <div className="profile-detail-group">
                <div className="profile-detail-label">Candidats</div>
                <div className="profile-detail-value">0 candidat(s)</div>
              </div>
              
              <div className="profile-detail-group">
                <div className="profile-detail-label">Publications</div>
                <div className="profile-detail-value">0 publication(s)</div>
              </div>
            </div>
            
            <div className="profile-actions">
              <Link to={`/publications/new?profileId=${profile.id}`} className="action-button publish">
                <span className="material-icons">publish</span>
                Générer une annonce
              </Link>
              
              <button className="action-button">
                <span className="material-icons">edit</span>
                Modifier le profil
              </button>
              
              <button className="action-button">
                <span className="material-icons">content_copy</span>
                Dupliquer le profil
              </button>
              
              <button className="action-button">
                <span className="material-icons">delete</span>
                Supprimer le profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetail;