import apiClient from './apiClient.js';

// Fonction pour créer un compte
function register(userData) {
  return apiClient.post('auth/register', userData);
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
  console.log('🔍 Sauvegarde utilisateur:', user);
  localStorage.setItem('user', JSON.stringify(user));
}

// Fonction pour récupérer les infos utilisateur
function getUser() {
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;
  console.log('🔍 Récupération utilisateur:', parsedUser);
  return parsedUser;
}

// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
  return !!getToken();
}

// Fonction pour vérifier si l'utilisateur connecté est admin
function isAdmin() {
  const user = getUser();
  console.log('🔍 Vérification admin pour:', user);
  if (!user) return false;
  // Vérifier si l'utilisateur a le rôle 'admin' dans la base de données
  const isAdminUser = user.role === 'admin';
  console.log('🔍 Est admin?', isAdminUser, 'Role:', user.role);
  return isAdminUser;
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
