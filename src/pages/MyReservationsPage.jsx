import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import reservationService from '../services/reservationService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/MyReservationsPage.css';

const MyReservationsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [showNewReservationMessage, setShowNewReservationMessage] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadReservations();

    // Vérifier s'il y a une nouvelle réservation via l'URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
      setShowNewReservationMessage(true);
      // Actualiser après un délai pour laisser le temps au backend de traiter
      setTimeout(() => {
        loadReservations();
      }, 1000);
      
      // Masquer le message après quelques secondes
      setTimeout(() => {
        setShowNewReservationMessage(false);
      }, 5000);
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Début du chargement des réservations...');
      
      // VÉRIFICATION UTILISATEUR CONNECTÉ
      const currentUser = authService.getUser();
      console.log('👤 Utilisateur connecté actuel:', currentUser);
      console.log('👤 ID utilisateur pour filtrage:', currentUser?.id_customer || currentUser?.id || currentUser?.customer_id);
      
      // Récupérer les vraies réservations de l'utilisateur connecté
      const userReservations = await reservationService.getMyReservations();
      
      console.log('🔍 Réservations récupérées pour l\'utilisateur:', userReservations);
      console.log('🔍 Type de données reçues:', typeof userReservations);
      console.log('🔍 Est-ce un tableau?', Array.isArray(userReservations));
      
      // VALIDATION CRITIQUE: Vérifier si ce sont vraiment les bonnes réservations
      if (Array.isArray(userReservations) && userReservations.length > 0) {
        console.log('🔍 VÉRIFICATION: Première réservation reçue:', userReservations[0]);
        userReservations.forEach((reservation, index) => {
          const resUserId = reservation.id_customer || reservation.customerId || reservation.userId || reservation.customer_id;
          console.log(`📋 Réservation ${index + 1}: ID client = ${resUserId}, ID réservation = ${reservation.id || reservation.id_reservation}`);
        });
      }
      
      // S'assurer que c'est un tableau
      const reservationsArray = Array.isArray(userReservations) ? userReservations : [];
      
      console.log('📊 Nombre final de réservations à afficher:', reservationsArray.length);
      
      setReservations(reservationsArray);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des réservations:', err);
      setError('Impossible de charger vos réservations. ' + err.message);
      setReservations([]); // S'assurer que la liste est vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour actualiser les réservations
  const refreshReservations = () => {
    loadReservations();
  };

  // Fonction de debug temporaire
  const debugUserAndReservations = () => {
    const currentUser = authService.getUser();
    console.log('=== DEBUG COMPLET ===');
    console.log('Utilisateur connecté:', currentUser);
    console.log('Token:', authService.getToken());
    console.log('Réservations actuelles:', reservations);
    console.log('=====================');
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'attente': 'En attente',
      'confirme': 'Confirmée',
      'annule': 'Annulée',
      'termine': 'Terminée'
    };
    return statusLabels[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'attente': 'warning',
      'confirme': 'success',
      'annule': 'danger',
      'termine': 'secondary'
    };
    return statusClasses[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getFilteredReservations = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    switch (filter) {
      case 'upcoming':
        return reservations.filter(res => 
          res.check_in_date >= today && res.reservation_status !== 'annule'
        );
      case 'past':
        return reservations.filter(res => 
          res.check_out_date < today || res.reservation_status === 'termine'
        );
      case 'cancelled':
        return reservations.filter(res => res.reservation_status === 'annule');
      default:
        return reservations;
    }
  };

  const filteredReservations = getFilteredReservations();

  if (loading) {
    return (
      <div className="my-reservations-page">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement de vos réservations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reservations-page">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            {/* En-tête */}
            <div className="reservations-header mb-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <button 
                    className="btn btn-outline-secondary mb-3"
                    onClick={() => navigate('/profile')}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Retour au profil
                  </button>
                  <h1 className="reservations-title">
                    <i className="fas fa-calendar-check me-3"></i>
                    Mes Réservations
                  </h1>
                  {user && (
                    <p className="text-muted">
                      Bonjour {user.first_name || user.firstName || user.prenom || 'Cher client'}, 
                      voici l'historique de vos réservations
                    </p>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={refreshReservations}
                    disabled={loading}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    {loading ? 'Actualisation...' : 'Actualiser'}
                  </button>
                  <button 
                    className="btn btn-outline-info"
                    onClick={debugUserAndReservations}
                  >
                    <i className="fas fa-bug me-2"></i>
                    Debug
                  </button>
                </div>
              </div>
            </div>

            {/* Message de nouvelle réservation */}
            {showNewReservationMessage && (
              <div className="alert alert-success mb-4">
                <i className="fas fa-check-circle me-2"></i>
                <strong>Réservation confirmée !</strong> Votre nouvelle réservation apparaîtra dans la liste ci-dessous une fois traitée.
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="alert alert-danger mb-4">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* Filtres */}
            <div className="reservation-filters mb-4">
              <div className="btn-group" role="group">
                <button 
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  <i className="fas fa-list me-1"></i>
                  Toutes ({reservations.length})
                </button>
                <button 
                  className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('upcoming')}
                >
                  <i className="fas fa-clock me-1"></i>
                  À venir
                </button>
                <button 
                  className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('past')}
                >
                  <i className="fas fa-history me-1"></i>
                  Passées
                </button>
                <button 
                  className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('cancelled')}
                >
                  <i className="fas fa-times me-1"></i>
                  Annulées
                </button>
              </div>
            </div>

            {/* Liste des réservations */}
            {filteredReservations.length === 0 ? (
              <div className="no-reservations">
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times fa-4x text-muted mb-3"></i>
                  <h4 className="text-muted">Aucune réservation trouvée</h4>
                  <p className="text-muted mb-4">
                    {filter === 'all' 
                      ? "Vous n'avez encore effectué aucune réservation."
                      : `Aucune réservation ${filter === 'upcoming' ? 'à venir' : filter === 'past' ? 'passée' : 'annulée'}.`
                    }
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/reservation')}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Faire une réservation
                  </button>
                </div>
              </div>
            ) : (
              <div className="reservations-list">
                {filteredReservations.map((reservation) => (
                  <div key={reservation.id_reservation} className="reservation-card">
                    <div className="card">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <h5 className="card-title">
                              <i className="fas fa-bed me-2"></i>
                              {reservation.room_name}
                            </h5>
                            <p className="card-text">
                              <i className="fas fa-calendar me-2"></i>
                              <strong>Du :</strong> {formatDate(reservation.check_in_date)} 
                              <strong className="ms-3">Au :</strong> {formatDate(reservation.check_out_date)}
                            </p>
                            <p className="card-text">
                              <i className="fas fa-users me-2"></i>
                              <strong>Voyageurs :</strong> {reservation.guest_count} personne(s)
                            </p>
                          </div>
                          <div className="col-md-3 text-center">
                            <div className="reservation-price">
                              {formatPrice(reservation.total_cost)}
                            </div>
                          </div>
                          <div className="col-md-3 text-end">
                            <span className={`badge bg-${getStatusClass(reservation.reservation_status)} mb-2`}>
                              {getStatusLabel(reservation.reservation_status)}
                            </span>
                            <div className="reservation-actions">
                              <small className="text-muted d-block">
                                Réservation #{reservation.id_reservation}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions rapides */}
            <div className="quick-actions mt-5">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <button 
                    className="action-card w-100"
                    onClick={() => navigate('/reservation')}
                  >
                    <i className="fas fa-plus-circle"></i>
                    <h5>Nouvelle réservation</h5>
                    <p>Réserver une nouvelle chambre</p>
                  </button>
                </div>
                <div className="col-md-6 mb-3">
                  <button 
                    className="action-card w-100"
                    onClick={() => navigate('/profile')}
                  >
                    <i className="fas fa-user-edit"></i>
                    <h5>Modifier mon profil</h5>
                    <p>Mettre à jour mes informations</p>
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

export default MyReservationsPage;
