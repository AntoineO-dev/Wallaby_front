import axios from 'axios';

// Configuration simple de l'URL de base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/';

// Création d'une instance Axios avec l'URL de base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token à chaque requête si il existe
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export default apiClient;
