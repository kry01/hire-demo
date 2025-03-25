import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const CVImport = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [uploadType, setUploadType] = useState('local'); // 'local' ou 'url'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  
  // Simuler l'importation d'un CV
  const onSubmit = async (data) => {
    setIsUploading(true);
    
    // Simulation d'un appel API
    setTimeout(() => {
      if (uploadType === 'local' && data.cvFiles?.length > 0) {
        // Traiter les fichiers locaux
        const files = Array.from(data.cvFiles);
        
        const newFiles = files.map(file => ({
          id: Date.now() + Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          status: 'processing'
        }));
        
        setUploadedFiles(prev => [...prev, ...newFiles]);
        
        // Simuler le traitement des fichiers
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              newFiles.find(nf => nf.id === f.id) 
                ? { ...f, status: 'completed' } 
                : f
            )
          );
        }, 2000);
      } else if (uploadType === 'url' && data.linkedinUrl) {
        // Traiter les URL LinkedIn
        const newFile = {
          id: Date.now() + Math.random().toString(36).substring(2, 9),
          name: `LinkedIn Profile: ${data.linkedinUrl}`,
          source: 'linkedin',
          uploadDate: new Date().toISOString(),
          status: 'processing'
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Simuler le traitement
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, status: 'completed' } 
                : f
            )
          );
        }, 2000);
      }
      
      setIsUploading(false);
    }, 1500);
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Ici vous pouvez directement utiliser les fichiers ou les ajouter au formulaire
      const files = Array.from(e.dataTransfer.files);
      
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Simuler le traitement des fichiers
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            newFiles.find(nf => nf.id === f.id) 
              ? { ...f, status: 'completed' } 
              : f
          )
        );
      }, 2000);
    }
  };
  
  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <>
      <div className="dashboard-header">
        <h1 className="page-title">Importer des CV</h1>
      </div>
      
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Ajoutez de nouveaux candidats</h2>
          <p className="form-subtitle">Importez des CV depuis votre ordinateur ou depuis LinkedIn.</p>
        </div>
        
        <div className="import-options">
          <div className="option-tabs">
            <button 
              className={`option-tab ${uploadType === 'local' ? 'active' : ''}`}
              onClick={() => setUploadType('local')}
            >
              <span className="material-icons">upload_file</span>
              Importer depuis l'ordinateur
            </button>
            <button 
              className={`option-tab ${uploadType === 'url' ? 'active' : ''}`}
              onClick={() => setUploadType('url')}
            >
              <span className="material-icons">link</span>
              Importer depuis LinkedIn
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {uploadType === 'local' ? (
            <div className="form-section">
              <div 
                className={`file-drop-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="file-drop-content">
                  <span className="material-icons file-icon">description</span>
                  <h3 className="file-title">Glissez-déposez vos fichiers ici</h3>
                  <p className="file-subtitle">ou</p>
                  <label className="btn btn-primary">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="file-input"
                      {...register('cvFiles')}
                    />
                    Parcourir les fichiers
                  </label>
                  <p className="file-types">Formats acceptés: PDF, DOC, DOCX</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="form-section">
              <div className="form-group">
                <label className="input-label" htmlFor="linkedinUrl">URL du profil LinkedIn</label>
                <input 
                  type="url" 
                  id="linkedinUrl" 
                  className="form-control"
                  placeholder="https://www.linkedin.com/in/username"
                  {...register('linkedinUrl', { 
                    required: 'Veuillez entrer une URL LinkedIn',
                    pattern: {
                      value: /^https:\/\/www\.linkedin\.com\/in\/.+/,
                      message: 'Veuillez entrer une URL LinkedIn valide'
                    }
                  })}
                />
                {errors.linkedinUrl && <div className="form-error">{errors.linkedinUrl.message}</div>}
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isUploading}
            >
              <span className="material-icons btn-icon">upload</span>
              {isUploading ? 'Importation en cours...' : 'Importer'}
            </button>
          </div>
        </form>
        
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            <h3 className="section-title">Fichiers importés</h3>
            <div className="files-list">
              {uploadedFiles.map(file => (
                <div key={file.id} className="file-item">
                  <div className="file-icon">
                    <span className="material-icons">
                      {file.source === 'linkedin' ? 'link' : 'description'}
                    </span>
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    {file.size && <div className="file-size">{getFileSize(file.size)}</div>}
                    <div className="file-date">Importé le {new Date(file.uploadDate).toLocaleString()}</div>
                  </div>
                  <div className="file-status">
                    {file.status === 'processing' ? (
                      <span className="badge badge-warning">En traitement</span>
                    ) : (
                      <span className="badge badge-success">Traité</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CVImport;