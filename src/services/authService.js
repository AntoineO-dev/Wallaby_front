import apiClient from './apiClient.js';

// Fonction pour créer un compte
function register(userData) {
  console.log('📤 authService.register - Données envoyées au serveur:', userData);
  
  // Normaliser les données avant envoi pour s'adapter aux attentes du backend
  const normalizedData = {
    // Essayer différents formats de noms
    first_name: userData.firstName || userData.first_name,
    last_name: userData.lastName || userData.last_name,
    firstName: userData.firstName || userData.first_name,
    lastName: userData.lastName || userData.last_name,
    // Données de base
    email: userData.email,
    password: userData.password,
    // Informations optionnelles
    phone: userData.phone || userData.telephone,
    role: userData.role || 'user'
  };
  
  console.log('📤 Données normalisées envoyées:', normalizedData);
  
  return apiClient.post('auth/register', normalizedData);
}

// Fonction pour se connecter
function login(email, password) {
  return apiClient.post('auth/login', {
    email: email,
    password: password
  });
}

// Fonction pour se déconnecter
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Fonction pour sauvegarder le token
function saveToken(token) {
  localStorage.setItem('token', token);
}

// Fonction pour récupérer le token
function getToken() {
  return localStorage.getItem('token');
}

// Fonction pour sauvegarder les infos utilisateur
function saveUser(user) {
  console.log('💾 authService.saveUser - Données reçues:', user);
  
  // Normaliser les données utilisateur pour s'assurer de la cohérence
  const normalizedUser = {
    // IDs
    id: user.id || user.id_customer || user.customer_id,
    id_customer: user.id_customer || user.id || user.customer_id,
    
    // Email
    email: user.email,
    
    // Noms - supporter tous les formats possibles
    first_name: user.first_name || user.firstName || user.prenom || user.firstname,
    last_name: user.last_name || user.lastName || user.nom || user.lastname,
    
    // Contact
    phone: user.phone || user.telephone || user.tel,
    
    // Rôle
    role: user.role || 'user',
    
    // Dates
    registration_date: user.registration_date || user.created_at || new Date().toISOString(),
    
    // Autres informations potentielles
    address: user.address || user.adresse,
    city: user.city || user.ville,
    postal_code: user.postal_code || user.code_postal,
    country: user.country || user.pays || 'France'
  };
  
  console.log('💾 Données normalisées à sauvegarder:', normalizedUser);
  console.log('🔍 Prénom final:', normalizedUser.first_name);
  console.log('� Nom final:', normalizedUser.last_name);
  
  // Vérification critique
  if (!normalizedUser.first_name || !normalizedUser.last_name) {
    console.error('❌ ATTENTION: Prénom ou nom manquant dans les données normalisées!');
    console.error('📊 Données originales:', user);
  }
  
  localStorage.setItem('user', JSON.stringify(normalizedUser));
  
  // Vérification post-sauvegarde
  const saved = localStorage.getItem('user');
  const parsed = JSON.parse(saved);
  console.log('✅ Vérification post-sauvegarde:', parsed);
}

// Fonction pour récupérer les infos utilisateur
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
  return !!getToken();
}

// Fonction pour vérifier si l'utilisateur connecté est admin
function isAdmin() {
  const user = getUser();
  if (!user) return false;
  // Vérifier si l'utilisateur a le rôle 'admin' dans la base de données
  return user.role === 'admin';
}

// Fonction pour récupérer le rôle de l'utilisateur
function getUserRole() {
  const user = getUser();
  if (!user) return null;
  return user.role || 'user'; // Par défaut 'user' si pas de rôle défini
}

// Fonction pour récupérer le rôle admin de l'utilisateur (compatibilité)
function getAdminRole() {
  const user = getUser();
  if (!user || user.role !== 'admin') return null;
  // Si l'utilisateur est admin, on retourne 'super_admin' par défaut
  // Vous pouvez étendre la DB pour avoir des sous-rôles admin plus tard
  return 'super_admin';
}

// Fonction pour vérifier une permission spécifique
function hasAdminPermission(requiredRole = 'admin') {
  const user = getUser();
  if (!user) return false;
  
  // Si l'utilisateur a le rôle admin dans la DB, il a toutes les permissions
  if (user.role === 'admin') return true;
  
  return false;
}

export default {
  register,
  login,
  logout,
  saveToken,
  getToken,
  saveUser,
  getUser,
  isLoggedIn,
  isAdmin,
  getUserRole,
  getAdminRole,
  hasAdminPermission
};
