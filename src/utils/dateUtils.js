/**
 * Utilitaires pour la gestion des dates
 */

/**
 * Formate une date en format local
 * @param {string|Date} date - La date à formater
 * @param {Object} options - Options de formatage
 * @returns {string} Date formatée
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) {
    console.error('Date invalide:', date);
    return '';
  }
  
  const defaultOptions = { 
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  };
  
  return dateObj.toLocaleDateString('fr-FR', { ...defaultOptions, ...options });
};

/**
 * Calcule le temps écoulé depuis une date donnée
 * @param {string|Date} date - La date à comparer
 * @returns {string} Description du temps écoulé
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) {
    console.error('Date invalide:', date);
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  // Moins d'une minute
  if (diffInSeconds < 60) {
    return 'À l\'instant';
  }
  
  // Moins d'une heure
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  // Moins d'un jour
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  }
  
  // Moins d'une semaine
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'Hier' : `Il y a ${diffInDays} jours`;
  }
  
  // Moins d'un mois
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  }
  
  // Moins d'un an
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `Il y a ${diffInMonths} mois`;
  }
  
  // Plus d'un an
  const diffInYears = Math.floor(diffInDays / 365);
  return `Il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
};

/**
 * Vérifie si une date est récente (moins de 24h)
 * @param {string|Date} date - La date à vérifier
 * @returns {boolean} True si la date est récente
 */
export const isRecent = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Vérifier si la date est valide
  if (isNaN(dateObj.getTime())) {
    console.error('Date invalide:', date);
    return false;
  }
  
  const now = new Date();
  const diffInHours = Math.floor((now - dateObj) / (1000 * 60 * 60));
  
  return diffInHours < 24;
}; 