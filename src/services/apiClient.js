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
    console.log(`🔐 Requête ${config.method?.toUpperCase()} vers ${config.url} avec token`);
  } else {
    console.warn(`⚠️ Requête ${config.method?.toUpperCase()} vers ${config.url} SANS token`);
  }
  console.log('📤 Détails de la requête:', {
    method: config.method,
    url: config.url,
    data: config.data,
    params: config.params
  });
  return config;
});

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Réponse ${response.status} de ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ Erreur ${error.response?.status} de ${error.config?.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default apiClient;
