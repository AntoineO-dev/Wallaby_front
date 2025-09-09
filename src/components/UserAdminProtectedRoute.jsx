import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/UserAdminProtection.css';

const UserAdminProtectedRoute = ({ children }) => {
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  const adminRole = authService.getAdminRole();

  // Si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
    return (
      <div className="admin-access-denied">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="access-denied-card">
                <div className="text-center">
                  <i className="fas fa-user-slash denied-icon"></i>
                  <h2 className="denied-title">Accès Refusé</h2>
                  <p className="denied-message">
                    Vous devez être connecté pour accéder à cette section.
                  </p>
                  <div className="denied-actions">
                    <button 
                      className="btn btn-primary me-3"
                      onClick={() => window.location.href = '/#login'}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Se connecter
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => window.location.href = '/'}
                    >
                      <i className="fas fa-home me-2"></i>
                      Retour à l'accueil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est connecté mais pas admin
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="access-denied-card">
                <div className="text-center">
                  <i className="fas fa-shield-alt denied-icon"></i>
                  <h2 className="denied-title">Accès Administrateur Requis</h2>
                  <p className="denied-message">
                    Votre compte ne dispose pas des privilèges administrateur 
                    nécessaires pour accéder à cette section.
                  </p>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Compte connecté :</strong> {authService.getUser()?.email}
                  </div>
                  <div className="denied-actions">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => window.location.href = '/'}
                    >
                      <i className="fas fa-home me-2"></i>
                      Retour à l'accueil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est admin, afficher le contenu avec informations
  return (
    <div className="admin-authenticated">
      <div className="admin-info-bar">
        <div className="container-fluid">
          <div className="row align-items-center py-2">
            <div className="col">
              <small className="text-white">
                <i className="fas fa-user-shield me-1"></i>
                <strong>{authService.getUser()?.email}</strong>
                <span className="badge bg-light text-dark ms-2">
                  {adminRole?.toUpperCase()}
                </span>
              </small>
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-sm btn-outline-light"
                onClick={() => {
                  authService.logout();
                  window.location.href = '/';
                }}
                title="Se déconnecter"
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default UserAdminProtectedRoute;
