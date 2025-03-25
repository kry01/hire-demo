/**
 * Utilitaires pour la gestion des erreurs
 */

/**
 * Formater un message d'erreur pour l'affichage
 * @param {Error|string} error - L'erreur à formater
 * @returns {string} Message d'erreur formaté
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'Une erreur inconnue est survenue';
  
  // Si c'est déjà une chaîne de caractères
  if (typeof error === 'string') return error;
  
  // Si c'est une erreur avec un message
  if (error.message) return error.message;
  
  // Fallback
  return 'Une erreur est survenue';
};

/**
 * Logger une erreur dans la console avec informations supplémentaires
 * @param {Error|string} error - L'erreur à logger
 * @param {string} context - Le contexte de l'erreur
 * @param {Object} additionalData - Données supplémentaires
 */
export const logError = (error, context = '', additionalData = {}) => {
  console.error(`[${context}]`, error);
  
  if (Object.keys(additionalData).length > 0) {
    console.error('Données supplémentaires:', additionalData);
  }
  
  // On pourrait ajouter ici un système de reporting d'erreurs
  // comme Sentry ou LogRocket
};

/**
 * Gérer une erreur de requête API
 * @param {Error} error - L'erreur de la requête
 * @returns {string} Message d'erreur utilisateur
 */
export const handleApiError = (error) => {
  // Log l'erreur
  logError(error, 'API Request');
  
  // Vérifier s'il s'agit d'une erreur réseau
  if (!navigator.onLine) {
    return 'Vous semblez être hors ligne. Veuillez vérifier votre connexion Internet.';
  }
  
  // Erreur de timeout
  if (error.message && error.message.includes('timeout')) {
    return 'La requête a pris trop de temps. Veuillez réessayer.';
  }
  
  // Erreur de serveur
  if (error.status >= 500) {
    return 'Le serveur a rencontré une erreur. Veuillez réessayer plus tard.';
  }
  
  // Erreur d'authentification
  if (error.status === 401) {
    return 'Votre session a expiré. Veuillez vous reconnecter.';
  }
  
  // Erreur d'autorisation
  if (error.status === 403) {
    return 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.';
  }
  
  // Erreur de ressource non trouvée
  if (error.status === 404) {
    return 'La ressource demandée n\'a pas été trouvée.';
  }
  
  // Erreur de validation
  if (error.status === 422 || error.status === 400) {
    if (error.data && error.data.errors) {
      // Retourner le premier message d'erreur de validation
      const firstError = Object.values(error.data.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
  }
  
  // Message par défaut
  return formatErrorMessage(error);
}; 