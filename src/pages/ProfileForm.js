import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { profileService, projectService } from '../services/mockApi';

const ProfileForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Options pour les champs de formulaire
  const contractTypes = ['CDI', 'CDD', 'Freelance', 'Stage'];
  const locationTypes = ['Télétravail', 'Hybride', 'Présentiel'];
  
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        navigate('/');
        return;
      }
      
      try {
        const projectData = await projectService.getProjectById(parseInt(projectId));
        if (!projectData) {
          alert('Projet non trouvé.');
          navigate('/');
          return;
        }
        
        setProject(projectData);
      } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
        alert('Erreur lors du chargement du projet.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, navigate]);
  
  const onSubmit = async (data) => {
    try {
      // Ajout du projectId aux données du profil
      const profileData = {
        ...data,
        projectId: parseInt(projectId)
      };
      
      await profileService.createProfile(profileData);
      alert('Profil créé avec succès!');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      alert('Erreur lors de la création du profil.');
    }
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
        <h1 className="page-title">Créer un nouveau profil de poste</h1>
      </div>
      
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">
            <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '10px' }}>business</span>
            {project.title}
          </h2>
          <p className="form-subtitle">Département: {project.department}</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <h3 className="form-section-title">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>work</span>
              Informations générales
            </h3>
            
            <div className="form-group">
              <label className="input-label" htmlFor="title">Intitulé du poste*</label>
              <input 
                id="title"
                type="text"
                className="form-control"
                placeholder="Ex: Développeur Full-Stack React/Node.js"
                {...register('title', { 
                  required: 'L\'intitulé du poste est obligatoire' 
                })}
              />
              {errors.title && <div className="form-error">{errors.title.message}</div>}
            </div>
            
            <div className="input-row">
              <div className="form-group">
                <label className="input-label" htmlFor="contractType">Type de contrat*</label>
                <select 
                  id="contractType"
                  className="form-control"
                  {...register('contractType', { 
                    required: 'Le type de contrat est obligatoire' 
                  })}
                >
                  <option value="">Sélectionnez un type de contrat</option>
                  {contractTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.contractType && <div className="form-error">{errors.contractType.message}</div>}
              </div>
              
              <div className="form-group">
                <label className="input-label" htmlFor="location">Lieu du poste*</label>
                <select 
                  id="location"
                  className="form-control"
                  {...register('location', { 
                    required: 'Le lieu du poste est obligatoire' 
                  })}
                >
                  <option value="">Sélectionnez un lieu</option>
                  {locationTypes.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.location && <div className="form-error">{errors.location.message}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="input-label" htmlFor="experience">Expérience requise (en années)*</label>
              <input 
                id="experience"
                type="number"
                className="form-control"
                min="0"
                placeholder="Ex: 3"
                {...register('experience', { 
                  required: 'L\'expérience requise est obligatoire',
                  min: { value: 0, message: 'L\'expérience ne peut pas être négative' }
                })}
              />
              {errors.experience && <div className="form-error">{errors.experience.message}</div>}
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>description</span>
              Description du poste
            </h3>
            
            <div className="form-group">
              <label className="input-label" htmlFor="startDate">Date de début*</label>
              <input 
                id="startDate"
                type="date"
                className="form-control"
                {...register('startDate', { 
                  required: 'La date de début est obligatoire' 
                })}
              />
              {errors.startDate && <div className="form-error">{errors.startDate.message}</div>}
            </div>
            
            <div className="form-group">
              <label className="input-label" htmlFor="description">Description</label>
              <textarea 
                id="description"
                className="form-control"
                rows={6}
                placeholder="Décrivez le poste, les responsabilités, et les attentes..."
                {...register('description')}
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>psychology</span>
              Compétences et qualifications
            </h3>
            
            <div className="form-group">
              <label className="input-label" htmlFor="technicalSkills">Compétences techniques*</label>
              <input 
                id="technicalSkills"
                type="text"
                className="form-control"
                placeholder="Ex: React, Node.js, MongoDB (séparées par des virgules)"
                {...register('technicalSkills', { 
                  required: 'Les compétences techniques sont obligatoires' 
                })}
              />
              {errors.technicalSkills && <div className="form-error">{errors.technicalSkills.message}</div>}
              <div className="form-hint">Séparez les compétences par des virgules.</div>
            </div>
            
            <div className="form-group">
              <label className="input-label" htmlFor="softSkills">Compétences comportementales</label>
              <input 
                id="softSkills"
                type="text"
                className="form-control"
                placeholder="Ex: Travail en équipe, Communication, Leadership (séparées par des virgules)"
                {...register('softSkills')}
              />
              <div className="form-hint">Séparez les compétences par des virgules.</div>
            </div>
            
            <div className="form-group">
              <label className="input-label" htmlFor="languages">Langues requises</label>
              <input 
                id="languages"
                type="text"
                className="form-control"
                placeholder="Ex: Français, Anglais (séparées par des virgules)"
                {...register('languages')}
              />
              <div className="form-hint">Séparez les langues par des virgules.</div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              <span className="material-icons btn-icon">close</span>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons btn-icon">save</span>
              Créer le profil
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileForm;