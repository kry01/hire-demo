import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { profileService, publicationService } from '../services/mockApi';

const PublicationForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('profileId');
  
  const [profile, setProfile] = useState(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  
  // Options pour les plateformes
  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
    { id: 'indeed', name: 'Indeed', icon: 'language' },
    { id: 'company', name: 'Site Web', icon: 'language' },
    { id: 'monster', name: 'Monster', icon: 'language' }
  ];
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        navigate('/');
        return;
      }
      
      try {
        const profileData = await profileService.getProfileById(parseInt(profileId));
        if (!profileData) {
          alert('Profil non trouvé.');
          navigate('/');
          return;
        }
        
        setProfile(profileData);
        
        // Générer un contenu initial basé sur le profil
        const initialContent = generateJobDescription(profileData);
        setGeneratedContent(initialContent);
        setValue('content', initialContent);
        
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        alert('Erreur lors du chargement du profil.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [profileId, navigate, setValue]);
  
  // Fonction pour générer une description de poste (simulée)
  const generateJobDescription = (profile) => {
    return `# ${profile.title}

## À propos du poste
Nous recherchons un(e) ${profile.title} pour rejoindre notre équipe.

## Responsabilités
- Développer et maintenir des applications
- Collaborer avec l'équipe pour concevoir des solutions techniques
- Participer aux réunions d'équipe et aux revues de code

## Compétences requises
${profile.technicalSkills ? '- ' + profile.technicalSkills.split(',').join('\n- ') : ''}

## Informations complémentaires
- Type de contrat: ${profile.contractType}
- Lieu: ${profile.location}
- Expérience requise: ${profile.experience} ans

Rejoignez notre équipe et participez à des projets passionnants !`;
  };
  
  // Fonction pour régénérer le contenu (simulée)
  const handleRegenerate = () => {
    setGenerating(true);
    
    // Simulation d'un appel API de génération
    setTimeout(() => {
      const regeneratedContent = generateJobDescription(profile) + '\n\n[Contenu régénéré le ' + new Date().toLocaleString() + ']';
      setGeneratedContent(regeneratedContent);
      setValue('content', regeneratedContent);
      setGenerating(false);
    }, 1500);
  };
  
  // Fonction pour sélectionner une plateforme
  const handleSelectPlatform = (platformId) => {
    setSelectedPlatform(platformId);
    setValue('platform', platformId);
  };
  
  // Fonction pour publier l'annonce
  const onSubmit = async (data) => {
    try {
      setPublishing(true);
      
      // Création de la publication
      const publicationData = {
        profileId: parseInt(profileId),
        content: data.content,
        title: profile.title,
        platform: data.platform
      };
      
      const publication = await publicationService.createPublication(publicationData);
      
      // Simulation de publication sur la plateforme
      await publicationService.publishPublication(publication.id, data.platform);
      
      alert('Annonce publiée avec succès!');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la publication de l\'annonce:', error);
      alert('Erreur lors de la publication de l\'annonce.');
    } finally {
      setPublishing(false);
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
        <h1 className="page-title">Générer et publier une annonce</h1>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <span className="material-icons btn-icon">arrow_back</span>
          Retour
        </button>
      </div>
      
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">{profile.title}</h2>
          <p className="form-subtitle">Créez une annonce d'emploi basée sur le profil de poste sélectionné.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <h3 className="form-section-title">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>language</span>
              Sélectionnez une plateforme de publication
            </h3>
            
            <div className="platform-selector">
              {platforms.map(platform => (
                <div 
                  key={platform.id}
                  className={`platform-option ${selectedPlatform === platform.id ? 'selected' : ''}`}
                  onClick={() => handleSelectPlatform(platform.id)}
                >
                  <span className="material-icons platform-option-icon">{platform.icon}</span>
                  <span className="platform-option-name">{platform.name}</span>
                </div>
              ))}
            </div>
            
            <input 
              type="hidden"
              {...register('platform', { 
                required: 'Veuillez sélectionner une plateforme' 
              })}
            />
            {errors.platform && <div className="form-error">{errors.platform.message}</div>}
          </div>
          
          <div className="form-section">
            <div className="section-header" style={{ marginBottom: '15px' }}>
              <h3 className="form-section-title">
                <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>description</span>
                Contenu de l'annonce
              </h3>
              <button 
                type="button" 
                onClick={handleRegenerate}
                className="btn btn-secondary btn-sm"
                disabled={generating}
              >
                <span className="material-icons btn-icon">autorenew</span>
                {generating ? 'Génération...' : 'Régénérer'}
              </button>
            </div>
            
            <div className="form-group">
              <textarea 
                id="content"
                className="form-control"
                {...register('content', { 
                  required: 'Le contenu est obligatoire' 
                })}
                rows={12}
              ></textarea>
              {errors.content && <div className="form-error">{errors.content.message}</div>}
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="form-section-title">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>preview</span>
              Aperçu de l'annonce
            </h3>
            
            <div className="publication-preview">
              <div className="preview-header">
                <h4 className="preview-title">{profile.title}</h4>
                {selectedPlatform && (
                  <div className="preview-platform">
                    <span className="material-icons platform-icon">
                      {platforms.find(p => p.id === selectedPlatform)?.icon || 'language'}
                    </span>
                    <span className="platform-name">
                      {platforms.find(p => p.id === selectedPlatform)?.name || 'Plateforme'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="preview-content">
                {generatedContent.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h2 key={index} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{line.substring(2)}</h2>;
                  } else if (line.startsWith('## ')) {
                    return <h3 key={index} style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{line.substring(3)}</h3>;
                  } else if (line.startsWith('- ')) {
                    return <div key={index} style={{ marginBottom: '0.5rem', paddingLeft: '1rem' }}>• {line.substring(2)}</div>;
                  } else if (line === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} style={{ marginBottom: '0.75rem' }}>{line}</p>;
                  }
                })}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              <span className="material-icons btn-icon">close</span>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={publishing || !selectedPlatform}>
              <span className="material-icons btn-icon">publish</span>
              {publishing ? 'Publication en cours...' : 'Publier l\'annonce'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PublicationForm;