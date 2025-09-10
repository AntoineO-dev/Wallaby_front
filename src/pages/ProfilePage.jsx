import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    console.log('👤 Données utilisateur dans ProfilePage:', currentUser);
    console.log('📋 Clés disponibles:', Object.keys(currentUser));
    console.log('🔍 Prénom extrait:', currentUser.first_name || currentUser.firstName || currentUser.prenom);
    console.log('🔍 Nom extrait:', currentUser.last_name || currentUser.lastName || currentUser.nom);
    
    setUser(currentUser);
    
    // Normaliser les données en utilisant la même logique que authService
    setFormData({
      first_name: currentUser.first_name || currentUser.firstName || currentUser.prenom || '',
      last_name: currentUser.last_name || currentUser.lastName || currentUser.nom || '',
      email: currentUser.email || '',
      phone: currentUser.phone || currentUser.telephone || ''
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Appel API pour mettre à jour le profil
      // const response = await authService.updateProfile(formData);
      
      // Simulation de sauvegarde
      const updatedUser = { ...user, ...formData };
      authService.saveUser(updatedUser);
      setUser(updatedUser);
      setEditMode(false);
      setMessage('Profil mis à jour avec succès !');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de la mise à jour du profil');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setEditMode(false);
    setMessage('');
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Message de bienvenue personnalisé */}
            <div className="welcome-banner mb-4">
              <div className="welcome-content">
                <h2 className="welcome-message">
                  <i className="fas fa-hand-wave me-2"></i>
                  Bonjour {(user?.first_name || user?.firstName || user?.prenom) || 'cher client'} !
                </h2>
                <p className="welcome-subtitle">
                  Bienvenue dans votre espace personnel. Gérez votre profil et vos réservations en toute simplicité.
                </p>
              </div>
            </div>

            {/* En-tête */}
            <div className="profile-header mb-4">
              <button 
                className="btn btn-outline-secondary mb-3"
                onClick={() => navigate('/')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Retour à l'accueil
              </button>
              <h1 className="profile-title">
                <i className="fas fa-user-circle me-3"></i>
                Mon Profil
              </h1>
            </div>

            {/* Messages */}
            {message && (
              <div className={`alert ${message.includes('succès') ? 'alert-success' : 'alert-danger'} mb-4`}>
                <i className={`fas ${message.includes('succès') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                {message}
              </div>
            )}

            {/* Carte de profil */}
            <div className="profile-card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">
                    <i className="fas fa-user me-2"></i>
                    Informations personnelles
                  </h3>
                  {!editMode ? (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setEditMode(true)}
                    >
                      <i className="fas fa-edit me-1"></i>
                      Modifier
                    </button>
                  ) : (
                    <div className="btn-group">
                      <button 
                        className="btn btn-success"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        <i className="fas fa-save me-1"></i>
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        <i className="fas fa-times me-1"></i>
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Prénom
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="profile-info">
                        {(user?.first_name || user?.firstName || user?.prenom) || 'Non renseigné'}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Nom
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="profile-info">
                        {(user?.last_name || user?.lastName || user?.nom) || 'Non renseigné'}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="profile-info">{user.email}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-phone me-2"></i>
                      Téléphone
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Ex: 06 12 34 56 78"
                      />
                    ) : (
                      <div className="profile-info">
                        {(user?.phone || user?.telephone) || 'Non renseigné'}
                      </div>
                    )}
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">
                      <i className="fas fa-calendar me-2"></i>
                      Membre depuis
                    </label>
                    <div className="profile-info">
                      {user.registration_date ? new Date(user.registration_date).toLocaleDateString('fr-FR') : 'Non disponible'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="quick-actions mt-4">
              <h4 className="mb-3">
                <i className="fas fa-bolt me-2"></i>
                Actions rapides
              </h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <button 
                    className="action-card w-100"
                    onClick={() => navigate('/mes-reservations')}
                  >
                    <i className="fas fa-calendar-check"></i>
                    <h5>Mes réservations</h5>
                    <p>Consulter et gérer mes réservations</p>
                  </button>
                </div>
                <div className="col-md-6 mb-3">
                  <button 
                    className="action-card w-100"
                    onClick={() => navigate('/reservation')}
                  >
                    <i className="fas fa-plus-circle"></i>
                    <h5>Nouvelle réservation</h5>
                    <p>Réserver une chambre</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
