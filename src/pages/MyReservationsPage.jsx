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

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadReservations(currentUser.id_customer);
  }, [navigate]);

  const loadReservations = async (customerId) => {
    try {
      setLoading(true);
      // TODO: Implémenter l'appel API pour récupérer les réservations du client
      // const response = await reservationService.getReservationsByCustomer(customerId);
      
      // Simulation de données pour l'instant
      const mockReservations = [
        {
          id_reservation: 1,
          room_name: "Le Nid du Wallaby",
          check_in_date: "2025-10-15",
          check_out_date: "2025-10-18",
          total_cost: 450,
          reservation_status: "confirme",
          guest_count: 2
        },
        {
          id_reservation: 2,
          room_name: "La Prairie Sautillante",
          check_in_date: "2025-08-20",
          check_out_date: "2025-08-25",
          total_cost: 750,
          reservation_status: "termine",
          guest_count: 4
        }
      ];
      
      setReservations(mockReservations);
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
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
                <p className="text-muted">Bonjour {user.first_name}, voici l'historique de vos réservations</p>
              )}
            </div>

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
