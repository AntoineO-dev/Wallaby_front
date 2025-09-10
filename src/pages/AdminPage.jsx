import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../services/reservationService';
import authService from '../services/authService';
import '../../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  
  // États pour les données
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour les filtres
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('reservation_newest');
  
  // États pour les actions
  const [actionLoading, setActionLoading] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionType, setActionType] = useState('');

  // Obtenir les informations d'admin depuis authService
  const userRole = authService.getUserRole();
  const isUserAdmin = authService.isAdmin();
  const hasPermission = (permission) => {
    // Si l'utilisateur est admin dans la DB, il a toutes les permissions
    return isUserAdmin;
  };

  // Mapping des statuts en français
  const statusLabels = {
    'en_attente': 'En attente',
    'confirme': 'Confirmée',
    'annule': 'Annulée'
  };

  // Mapping des statuts avec couleurs
  const statusColors = {
    'en_attente': 'warning',
    'confirme': 'success',
    'annule': 'danger'
  };

  // Chargement initial des données
  useEffect(() => {
    loadData();
  }, []);

  // Filtrage et tri des réservations
  useEffect(() => {
    let filtered = [...reservations];

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(res => res.reservation_status === statusFilter);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(res => {
        const customer = res.customer || res.client || res;
        const customerName = formatCustomerName(res).toLowerCase();
        const roomName = formatRoomName(res).toLowerCase();
        
        return (
          res.id_reservation?.toString().includes(searchTerm) ||
          res.id_room?.toString().includes(searchTerm) ||
          res.id_customer?.toString().includes(searchTerm) ||
          customerName.includes(searchTerm.toLowerCase()) ||
          roomName.includes(searchTerm.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Trier
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.check_in_date) - new Date(a.check_in_date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.check_in_date) - new Date(b.check_in_date));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.total_cost || 0) - (a.total_cost || 0));
        break;
      case 'price_low':
        filtered.sort((a, b) => (a.total_cost || 0) - (b.total_cost || 0));
        break;
      case 'reservation_newest':
        // Tri par date de création de la réservation (plus récent en premier)
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || a.reservation_date || a.booking_date || a.updated_at);
          const dateB = new Date(b.created_at || b.reservation_date || b.booking_date || b.updated_at);
          console.log(`🔍 Tri reservation_newest - ID ${a.id || a.id_reservation}: ${dateA}, ID ${b.id || b.id_reservation}: ${dateB}`);
          return dateB - dateA;
        });
        break;
      case 'reservation_oldest':
        // Tri par date de création de la réservation (plus ancien en premier)
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || a.reservation_date || a.booking_date || a.updated_at);
          const dateB = new Date(b.created_at || b.reservation_date || b.booking_date || b.updated_at);
          return dateA - dateB;
        });
        break;
      default:
        // Tri par défaut : par date de création de la réservation (plus récent en premier)
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || a.reservation_date || a.booking_date || a.updated_at || a.check_in_date);
          const dateB = new Date(b.created_at || b.reservation_date || b.booking_date || b.updated_at || b.check_in_date);
          console.log(`🔍 Tri par défaut - ID ${a.id || a.id_reservation}: ${dateA}, ID ${b.id || b.id_reservation}: ${dateB}`);
          return dateB - dateA;
        });
        break;
    }

    setFilteredReservations(filtered);
  }, [reservations, statusFilter, searchTerm, sortBy]);

  // Fonction pour formater le nom du client
  const formatCustomerName = (reservation) => {
    // Essayer de récupérer les informations client de différentes façons
    const customer = reservation.customer || reservation.client || reservation;
    
    // Si on a les noms séparés
    if (customer.first_name && customer.last_name) {
      return `${customer.first_name} ${customer.last_name}`;
    }
    
    // Si on a un nom complet
    if (customer.name || customer.full_name || customer.customer_name) {
      return customer.name || customer.full_name || customer.customer_name;
    }
    
    // Si on a prénom ET nom dans des champs alternatifs
    if (customer.prenom && customer.nom) {
      return `${customer.prenom} ${customer.nom}`;
    }
    
    // Si on a firstName ET lastName
    if (customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`;
    }
    
    // Si on a l'email, l'utiliser comme identifiant
    if (customer.email) {
      return customer.email;
    }
    
    // Fallback : afficher l'ID
    return `Client ${reservation.id_customer || reservation.customer_id || 'inconnu'}`;
  };

  // Fonction pour formater le nom de la chambre
  const formatRoomName = (reservation) => {
    // Essayer de récupérer les informations de la chambre de différentes façons
    const room = reservation.room || reservation.chambre || reservation;
    
    // Si on a le nom de la chambre
    if (room.name || room.room_name || room.nom || room.title) {
      return room.name || room.room_name || room.nom || room.title;
    }
    
    // Si on a un type de chambre
    if (room.type || room.room_type || room.category) {
      return room.type || room.room_type || room.category;
    }
    
    // Mapping manuel des IDs vers les noms (basé sur votre structure de données)
    const roomNames = {
      1: 'Le Nid du Wallaby',
      2: 'La Prairie Sautillante', 
      3: "L'Oasis des Marsupiaux",
      4: 'Le Repos du Kangourou'
    };
    
    const roomId = reservation.id_room || reservation.room_id;
    if (roomNames[roomId]) {
      return roomNames[roomId];
    }
    
    // Fallback : afficher l'ID
    return `Chambre ${roomId || 'inconnue'}`;
  };

  // Charger toutes les données
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger les réservations et les statistiques en parallèle
      const [reservationsData, statsData] = await Promise.all([
        reservationService.getAllReservations(),
        reservationService.getReservationStats().catch(() => null) // Stats optionnelles
      ]);

      setReservations(reservationsData);
      setStats(statsData);
    } catch (err) {
      setError('Erreur lors du chargement des données: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirmer une réservation (Admin seulement)
  const handleConfirmReservation = async (reservationId) => {
    if (!isUserAdmin) {
      alert('Vous n\'avez pas les permissions pour confirmer des réservations.');
      return;
    }

    try {
      setActionLoading(reservationId);
      await reservationService.confirmReservation(reservationId);
      
      // Mettre à jour localement
      setReservations(prev => 
        prev.map(res => 
          res.id_reservation === reservationId 
            ? { ...res, reservation_status: 'confirme' }
            : res
        )
      );
      
      alert('Réservation confirmée avec succès !');
    } catch (err) {
      alert('Erreur lors de la confirmation: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Annuler une réservation (Admin seulement)
  const handleCancelReservation = async (reservationId, reason = '') => {
    if (!isUserAdmin) {
      alert('Seuls les administrateurs peuvent annuler des réservations.');
      return;
    }

    try {
      setActionLoading(reservationId);
      await reservationService.cancelReservation(reservationId, reason);
      
      // Mettre à jour localement
      setReservations(prev => 
        prev.map(res => 
          res.id_reservation === reservationId 
            ? { ...res, reservation_status: 'annule' }
            : res
        )
      );
      
      alert('Réservation annulée avec succès !');
    } catch (err) {
      alert('Erreur lors de l\'annulation: ' + err.message);
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
    }
  };

  // Ouvrir la modal de confirmation
  const openConfirmModal = (reservation, type) => {
    setSelectedReservation(reservation);
    setActionType(type);
    setShowConfirmModal(true);
  };

  // Formater les dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Formater les prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container-fluid py-4">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des données administrateur...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* En-tête */}
      <div className="admin-header">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-md-6">
              <h1 className="admin-title">
                <i className="fas fa-cog me-2"></i>
                Administration - Réservations
              </h1>
            </div>
            <div className="col-md-6 text-end">
              <button 
                className="btn btn-outline-secondary me-2"
                onClick={loadData}
                disabled={loading}
              >
                <i className="fas fa-sync-alt me-1"></i>
                Actualiser
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                <i className="fas fa-home me-1"></i>
                Retour au site
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        {/* Message d'information sur les permissions */}
        <div className="alert alert-info mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center">
                <i className="fas fa-info-circle me-2"></i>
                <div>
                  <strong>Niveau d'accès : {isUserAdmin ? 'ADMIN' : userRole?.toUpperCase()}</strong>
                  <div className="small text-muted mt-1">
                    {isUserAdmin && "Vous êtes administrateur du site avec accès complet à toutes les fonctionnalités."}
                    {!isUserAdmin && "Vous n'avez pas les droits d'administrateur."}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="permission-badges">
                <span className={`badge ${isUserAdmin ? 'bg-success' : 'bg-secondary'} me-1`}>
                  <i className="fas fa-eye me-1"></i>Consultation
                </span>
                <span className={`badge ${isUserAdmin ? 'bg-success' : 'bg-secondary'} me-1`}>
                  <i className="fas fa-check me-1"></i>Confirmation
                </span>
                <span className={`badge ${isUserAdmin ? 'bg-success' : 'bg-secondary'}`}>
                  <i className="fas fa-times me-1"></i>Annulation
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Statistiques - Visibles selon les permissions */}
        {hasPermission('manager') && stats && (
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-content">
                  <h3>{stats.total_reservations || 0}</h3>
                  <p>Total des réservations</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-icon bg-success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-content">
                  <h3>{stats.confirmed_count || 0}</h3>
                  <p>Confirmées</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <div className="stat-icon bg-warning">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-content">
                  <h3>{stats.pending_count || 0}</h3>
                  <p>En attente</p>
                </div>
              </div>
            </div>
            {hasPermission('super_admin') && (
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="stat-icon bg-info">
                    <i className="fas fa-euro-sign"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{formatPrice(stats.total_revenue || 0)}</h3>
                    <p>Chiffre d'affaires</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filtres et contrôles */}
        <div className="filters-section mb-4">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Filtrer par statut</label>
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="confirme">Confirmées</option>
                <option value="annule">Annulées</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Rechercher</label>
              <input
                type="text"
                className="form-control"
                placeholder="ID réservation, chambre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Trier par</label>
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="reservation_newest">Date de réservation (récent)</option>
                <option value="reservation_oldest">Date de réservation (ancien)</option>
                <option value="newest">Date d'arrivée (récent)</option>
                <option value="oldest">Date d'arrivée (ancien)</option>
                <option value="price_high">Prix décroissant</option>
                <option value="price_low">Prix croissant</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <div className="w-100">
                <div className="text-muted small">
                  {filteredReservations.length} réservation(s) affichée(s)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des réservations */}
        <div className="reservations-table-container">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
              <h4>Aucune réservation trouvée</h4>
              <p className="text-muted">
                {reservations.length === 0 
                  ? "Il n'y a encore aucune réservation dans le système."
                  : "Aucune réservation ne correspond aux critères de filtrage."
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover reservations-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Chambre</th>
                    <th>Client</th>
                    <th>Arrivée</th>
                    <th>Départ</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id_reservation}>
                      <td>
                        <strong>#{reservation.id_reservation}</strong>
                      </td>
                      <td>
                        <i className="fas fa-bed me-1"></i>
                        {formatRoomName(reservation)}
                      </td>
                      <td>
                        <i className="fas fa-user me-1"></i>
                        {formatCustomerName(reservation)}
                      </td>
                      <td>{formatDate(reservation.check_in_date)}</td>
                      <td>{formatDate(reservation.check_out_date)}</td>
                      <td>
                        <strong>{formatPrice(reservation.total_cost)}</strong>
                      </td>
                      <td>
                        <span className={`badge bg-${statusColors[reservation.reservation_status]}`}>
                          {statusLabels[reservation.reservation_status] || reservation.reservation_status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {/* Bouton Confirmer - Manager+ seulement */}
                          {reservation.reservation_status === 'en_attente' && hasPermission('manager') && (
                            <button
                              className="btn btn-sm btn-success me-1"
                              onClick={() => handleConfirmReservation(reservation.id_reservation)}
                              disabled={actionLoading === reservation.id_reservation}
                              title="Confirmer la réservation"
                            >
                              {actionLoading === reservation.id_reservation ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-check"></i>
                              )}
                            </button>
                          )}
                          
                          {/* Bouton Annuler - Super Admin seulement */}
                          {reservation.reservation_status !== 'annule' && hasPermission('super_admin') && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => openConfirmModal(reservation, 'cancel')}
                              disabled={actionLoading === reservation.id_reservation}
                              title="Annuler la réservation"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}

                          {/* Message pour les permissions insuffisantes */}
                          {!hasPermission('manager') && (
                            <small className="text-muted">
                              <i className="fas fa-lock me-1"></i>
                              Accès limité
                            </small>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmModal && selectedReservation && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {actionType === 'cancel' ? 'Annuler la réservation' : 'Confirmer l\'action'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {actionType === 'cancel' ? (
                  <div>
                    <p>
                      Êtes-vous sûr de vouloir annuler la réservation #{selectedReservation.id_reservation} ?
                    </p>
                    <div className="alert alert-warning">
                      <strong>Détails de la réservation :</strong><br/>
                      Chambre {selectedReservation.id_room}<br/>
                      Du {formatDate(selectedReservation.check_in_date)} au {formatDate(selectedReservation.check_out_date)}<br/>
                      Prix : {formatPrice(selectedReservation.total_cost)}
                    </div>
                  </div>
                ) : (
                  <p>Confirmer cette action ?</p>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className={`btn ${actionType === 'cancel' ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => {
                    if (actionType === 'cancel') {
                      handleCancelReservation(selectedReservation.id_reservation, 'Annulé par l\'administrateur');
                    }
                  }}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-1"></i>
                      Traitement...
                    </>
                  ) : (
                    actionType === 'cancel' ? 'Annuler la réservation' : 'Confirmer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
