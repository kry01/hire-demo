// Stockage local temporaire
let projects = [];
let profiles = [];
let nextProjectId = 1;
let nextProfileId = 1;
let publications = [];
let nextPublicationId = 1;
let cvFiles = [];
let nextCVId = 1;

// Service pour les projets
export const projectService = {
  // Créer un nouveau projet
  createProject: (projectData) => {
    if (!projectData || !projectData.title) {
      return Promise.reject(new Error('Les données du projet sont invalides'));
    }
    const newProject = {
      id: nextProjectId++,
      ...projectData,
      creationDate: new Date().toISOString(),
      status: 'Open'
    };
    projects.push(newProject);
    return Promise.resolve(newProject);
  },
  
  // Récupérer tous les projets
  getProjects: () => {
    return Promise.resolve([...projects]);
  },
  
  // Récupérer un projet par son ID
  getProjectById: (id) => {
    if (!id) {
      return Promise.reject(new Error('ID du projet requis'));
    }
    const project = projects.find(p => p.id === id);
    return Promise.resolve(project || null);
  }
};

// Service pour les profils
export const profileService = {
  // Créer un nouveau profil
  createProfile: (profileData) => {
    if (!profileData || !profileData.title) {
      return Promise.reject(new Error('Les données du profil sont invalides'));
    }
    const newProfile = {
      id: nextProfileId++,
      ...profileData,
      creationDate: new Date().toISOString()
    };
    profiles.push(newProfile);
    return Promise.resolve(newProfile);
  },
  
  // Récupérer tous les profils
  getProfiles: () => {
    return Promise.resolve([...profiles]);
  },
  
  // Récupérer un profil par son ID
  getProfileById: (id) => {
    if (!id) {
      return Promise.reject(new Error('ID du profil requis'));
    }
    const profile = profiles.find(p => p.id === id);
    return Promise.resolve(profile || null);
  },
  
  // Récupérer les profils par projet
  getProfilesByProject: (projectId) => {
    if (!projectId) {
      return Promise.reject(new Error('ID du projet requis'));
    }
    const projectProfiles = profiles.filter(p => p.projectId === projectId);
    return Promise.resolve(projectProfiles);
  },
};

// Service pour les publications
export const publicationService = {
  // Créer une nouvelle publication
  createPublication: (publicationData) => {
    if (!publicationData || !publicationData.title) {
      return Promise.reject(new Error('Les données de la publication sont invalides'));
    }
    const newPublication = {
      id: nextPublicationId++,
      ...publicationData,
      creationDate: new Date().toISOString(),
      status: 'draft'
    };
    publications.push(newPublication);
    return Promise.resolve(newPublication);
  },
  
  // Récupérer toutes les publications
  getPublications: () => {
    return Promise.resolve([...publications]);
  },
  
  // Récupérer une publication par son ID
  getPublicationById: (id) => {
    if (!id) {
      return Promise.reject(new Error('ID de la publication requis'));
    }
    const publication = publications.find(p => p.id === id);
    return Promise.resolve(publication || null);
  },
  
  // Publier une annonce
  publishPublication: (id, platform) => {
    if (!id || !platform) {
      return Promise.reject(new Error('ID et plateforme requis'));
    }
    const publicationIndex = publications.findIndex(p => p.id === id);
    
    if (publicationIndex === -1) {
      return Promise.reject(new Error('Publication non trouvée'));
    }
    
    publications[publicationIndex] = {
      ...publications[publicationIndex],
      status: 'published',
      platform,
      publishDate: new Date().toISOString()
    };
    
    return Promise.resolve(publications[publicationIndex]);
  },
  
  // Récupérer les publications par profil
  getPublicationsByProfile: (profileId) => {
    if (!profileId) {
      return Promise.reject(new Error('ID du profil requis'));
    }
    const profilePublications = publications.filter(p => p.profileId === profileId);
    return Promise.resolve(profilePublications);
  }
};

// Service pour les CV
export const cvService = {
    // Importer un nouveau CV
    importCV: (cvData) => {
        if (!cvData || !cvData.file) {
            return Promise.reject(new Error('Données du CV invalides'));
        }

        const newCV = {
            id: nextCVId++,
            ...cvData,
            importDate: new Date().toISOString(),
            status: 'imported',
            matchedProfiles: [],
            lastModified: new Date().toISOString()
        };
        cvFiles.push(newCV);
        return Promise.resolve(newCV);
    },
    
    // Récupérer tous les CV
    getCVs: () => {
        return Promise.resolve([...cvFiles]);
    },
    
    // Récupérer un CV par son ID
    getCVById: (id) => {
        if (!id) {
            return Promise.reject(new Error('ID du CV requis'));
        }
        const cv = cvFiles.find(c => c.id === id);
        if (!cv) {
            return Promise.reject(new Error('CV non trouvé'));
        }
        return Promise.resolve(cv);
    },
    
    // Analyser un CV
    analyzeCV: (id) => {
        if (!id) {
            return Promise.reject(new Error('ID du CV requis'));
        }

        const cvIndex = cvFiles.findIndex(c => c.id === id);
        
        if (cvIndex === -1) {
            return Promise.reject(new Error('CV non trouvé'));
        }
        
        // Simuler une analyse
        const analyzedCV = {
            ...cvFiles[cvIndex],
            status: 'analyzed',
            analyzedDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            analysis: {
                skills: ['JavaScript', 'React', 'Node.js'],
                experience: '3 ans',
                education: 'Master en Informatique',
                languages: ['Français', 'Anglais'],
                score: 85
            }
        };
        
        cvFiles[cvIndex] = analyzedCV;
        return Promise.resolve(analyzedCV);
    },

    // Mettre à jour le statut d'un CV
    updateCVStatus: (id, status) => {
        if (!id || !status) {
            return Promise.reject(new Error('ID et statut requis'));
        }

        const cvIndex = cvFiles.findIndex(c => c.id === id);
        
        if (cvIndex === -1) {
            return Promise.reject(new Error('CV non trouvé'));
        }

        cvFiles[cvIndex] = {
            ...cvFiles[cvIndex],
            status,
            lastModified: new Date().toISOString()
        };

        return Promise.resolve(cvFiles[cvIndex]);
    },

    // Associer un CV à un profil
    matchCVWithProfile: (cvId, profileId) => {
        if (!cvId || !profileId) {
            return Promise.reject(new Error('ID du CV et du profil requis'));
        }

        const cvIndex = cvFiles.findIndex(c => c.id === cvId);
        
        if (cvIndex === -1) {
            return Promise.reject(new Error('CV non trouvé'));
        }

        const matchedProfiles = cvFiles[cvIndex].matchedProfiles || [];
        if (!matchedProfiles.includes(profileId)) {
            matchedProfiles.push(profileId);
        }

        cvFiles[cvIndex] = {
            ...cvFiles[cvIndex],
            matchedProfiles,
            lastModified: new Date().toISOString()
        };

        return Promise.resolve(cvFiles[cvIndex]);
    }
};