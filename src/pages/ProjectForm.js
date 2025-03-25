import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { projectService } from '../services/mockApi';

const ProjectForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const navigate = useNavigate();
  const [managers, setManagers] = useState(['']);  // État pour stocker les responsables
  
  const departmentOptions = ['IT', 'RH', 'Finance', 'Marketing'];
  
  // Fonction pour ajouter un nouveau responsable
  const addManager = () => {
    setManagers([...managers, '']);
  };

  // Fonction pour mettre à jour un responsable
  const updateManager = (index, value) => {
    const newManagers = [...managers];
    newManagers[index] = value;
    setManagers(newManagers);
    
    // Mettre à jour la valeur dans react-hook-form
    setValue('managers', newManagers);
  };

  // Fonction pour supprimer un responsable
  const removeManager = (index) => {
    if (managers.length > 1) {
      const newManagers = [...managers];
      newManagers.splice(index, 1);
      setManagers(newManagers);
      
      // Mettre à jour la valeur dans react-hook-form
      setValue('managers', newManagers);
    }
  };
  
  const onSubmit = async (data) => {
    try {
      // Préparer les données avec la liste des responsables
      const projectData = {
        ...data,
        manager: managers[0], // Pour compatibilité rétroactive
        managers: managers.filter(m => m.trim() !== '')  // Filtre les champs vides
      };
      
      await projectService.createProject(projectData);
      alert('Projet créé avec succès!');
      navigate('/'); // Redirection vers le dashboard
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      alert('Erreur lors de la création du projet.');
    }
  };
  
  return (
    <>
      <div className="dashboard-header">
        <h1 className="page-title">Créer un nouveau projet</h1>
      </div>
      
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Informations du projet</h2>
          <p className="form-subtitle">Remplissez les informations pour créer un nouveau projet de recrutement.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <div className="form-group">
              <label className="input-label" htmlFor="title">Titre du projet</label>
              <input 
                id="title"
                type="text"
                className="form-control"
                placeholder="Ex: Recrutement Développeurs Full-Stack"
                {...register('title', { 
                  required: 'Le titre est obligatoire' 
                })}
              />
              {errors.title && <div className="form-error">{errors.title.message}</div>}
            </div>
            
            <div className="form-group">
              <label className="input-label" htmlFor="description">Description</label>
              <textarea 
                id="description"
                className="form-control"
                rows={4}
                placeholder="Décrivez le projet de recrutement..."
                {...register('description', { 
                  required: 'La description est obligatoire' 
                })}
              ></textarea>
              {errors.description && <div className="form-error">{errors.description.message}</div>}
            </div>
            
            <div className="form-group">
              <label className="input-label">Responsable(s) du projet</label>
              {managers.map((manager, index) => (
                <div key={index} className="manager-input-container">
                  <div className="input-with-button">
                    <input 
                      type="text"
                      className="form-control"
                      placeholder={`Ex: ${index === 0 ? 'Jean Dupont' : 'Autre responsable'}`}
                      value={manager}
                      onChange={(e) => updateManager(index, e.target.value)}
                      required={index === 0}
                    />
                    <div className="input-actions">
                      {index === managers.length - 1 && (
                        <button 
                          type="button" 
                          className="btn-icon-only" 
                          onClick={addManager}
                          title="Ajouter un responsable"
                        >
                          <span className="material-icons">add</span>
                        </button>
                      )}
                      {managers.length > 1 && (
                        <button 
                          type="button" 
                          className="btn-icon-only" 
                          onClick={() => removeManager(index)}
                          title="Supprimer ce responsable"
                        >
                          <span className="material-icons">remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                  {index === 0 && errors.manager && <div className="form-error">Le responsable principal est obligatoire</div>}
                </div>
              ))}
            </div>
            
            <div className="input-row">
              <div className="form-group">
                <label className="input-label" htmlFor="startDate">Date de début</label>
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
                <label className="input-label" htmlFor="endDate">Date de fin (prévisionnelle)</label>
                <input 
                  id="endDate"
                  type="date"
                  className="form-control"
                  {...register('endDate', { 
                    required: 'La date de fin est obligatoire',
                    validate: {
                      isAfterStartDate: (value, formValues) => 
                        !formValues.startDate || new Date(value) >= new Date(formValues.startDate) || 
                        'La date de fin doit être postérieure à la date de début'
                    }
                  })}
                />
                {errors.endDate && <div className="form-error">{errors.endDate.message}</div>}
              </div>
            </div>
            
            <div className="input-row">
              <div className="form-group">
                <label className="input-label" htmlFor="department">Service / Département</label>
                <select 
                  id="department"
                  className="form-control"
                  {...register('department', { 
                    required: 'Le département est obligatoire' 
                  })}
                >
                  <option value="">Sélectionnez un département</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <div className="form-error">{errors.department.message}</div>}
              </div>
              
              <div className="form-group">
                <label className="input-label" htmlFor="status">Statut</label>
                <select 
                  id="status"
                  className="form-control"
                  {...register('status')}
                  defaultValue="Open"
                >
                  <option value="Open">Ouvert</option>
                  <option value="Closed">Fermé</option>
                  <option value="On Hold">En attente</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons btn-icon">save</span>
              Créer le projet
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProjectForm;