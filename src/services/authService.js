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
  localStorage.setItem('user', JSON.stringify(user));
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

export default {
  register,
  login,
  logout,
  saveToken,
  getToken,
  saveUser,
  getUser,
  isLoggedIn
};
