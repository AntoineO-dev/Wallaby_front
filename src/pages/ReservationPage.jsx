import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import reservationService from '../services/reservationService';
import '../../styles/ReservationPage.css';

const ReservationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomParam = searchParams.get('room'); // Récupère le paramètre 'room' de l'URL
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    room: roomParam || '', // Pré-sélectionne la chambre si fournie dans l'URL
    checkIn: '',
    checkOut: '',
    guests: 1,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [availabilityChecking, setAvailabilityChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [isRoomLocked, setIsRoomLocked] = useState(false); // Pour verrouiller la sélection de chambre

  // Liste des chambres disponibles
  const rooms = [
    { value: 'nid-wallaby', label: 'Le Nid du Wallaby', price: 150 },
    { value: 'prairie-sautillante', label: 'La Prairie Sautillante', price: 140 },
    { value: 'oasis-marsupiaux', label: "L'Oasis des Marsupiaux", price: 180 },
    { value: 'repos-kangourou', label: 'Le Repos du Kangourou', price: 120 }
  ];

  // Gestion des changements du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Vérification automatique de disponibilité quand les dates ou la chambre changent
  useEffect(() => {
    if (formData.room && formData.checkIn && formData.checkOut) {
      checkAvailability();
    } else {
      setAvailabilityError('');
    }
  }, [formData.room, formData.checkIn, formData.checkOut]);

  // Verrouiller la chambre si elle vient des paramètres d'URL
  useEffect(() => {
    if (roomParam) {
      setIsRoomLocked(true);
      // Vérifier que la chambre existe dans la liste
      const roomExists = rooms.find(room => room.value === roomParam);
      if (!roomExists) {
        setError('Chambre non trouvée. Redirection vers la sélection générale.');
        setIsRoomLocked(false);
        setFormData(prev => ({ ...prev, room: '' }));
      }
    }
  }, [roomParam]);

  // Fonction pour vérifier la disponibilité
  const checkAvailability = async () => {
    // Vérifier que la date de départ est après la date d'arrivée
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setAvailabilityError('La date de départ doit être après la date d\'arrivée.');
      return;
    }

    setAvailabilityChecking(true);
    setAvailabilityError('');

    try {
      // Convertir la valeur de la chambre en ID numérique (selon votre base de données)
      const roomIdMap = {
        'nid-wallaby': 1,
        'prairie-sautillante': 2,
        'oasis-marsupiaux': 3,
        'repos-kangourou': 4
      };

      const roomId = roomIdMap[formData.room];
      
      const availabilityResult = await reservationService.checkRoomAvailability(
        roomId,
        formData.checkIn,
        formData.checkOut
      );

      if (!availabilityResult.isAvailable) {
        setAvailabilityError(
          `Cette chambre n'est pas disponible pour ces dates. ${
            availabilityResult.conflictingReservations?.length > 0 
              ? 'Il y a des réservations existantes sur cette période.' 
              : ''
          }`
        );
      }
    } catch (error) {
      setAvailabilityError(error.message);
    } finally {
      setAvailabilityChecking(false);
    }
  };

  // Calcul du nombre de nuits
  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  // Calcul du prix total
  const calculateTotal = () => {
    const nights = calculateNights();
    const selectedRoom = rooms.find(room => room.value === formData.room);
    if (selectedRoom && nights > 0) {
      return nights * selectedRoom.price;
    }
    return 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.room || !formData.checkIn || !formData.checkOut) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setLoading(false);
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('La date de départ doit être après la date d\'arrivée.');
      setLoading(false);
      return;
    }

    // Vérifier s'il y a une erreur de disponibilité
    if (availabilityError) {
      setError('Veuillez résoudre les problèmes de disponibilité avant de réserver.');
      setLoading(false);
      return;
    }

    try {
      // Convertir la valeur de la chambre en ID numérique
      const roomIdMap = {
        'nid-wallaby': 1,
        'prairie-sautillante': 2,
        'oasis-marsupiaux': 3,
        'repos-kangourou': 4
      };

      const reservationData = {
        ...formData,
        roomId: roomIdMap[formData.room],
        totalPrice: calculateTotal()
      };

      // Envoyer la réservation au backend
      const result = await reservationService.createReservation(reservationData);
      
      setSuccess(true);
      console.log('Réservation créée avec succès:', result);
      
      // Redirection après succès
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reservation-page">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="success-card">
                <div className="success-icon">✅</div>
                <h2>Réservation confirmée !</h2>
                <p>
                  Merci {formData.firstName} ! Votre demande de réservation a été envoyée avec succès.
                  Nous vous contacterons dans les plus brefs délais pour confirmer votre séjour.
                </p>
                <div className="booking-summary">
                  <h4>Récapitulatif de votre réservation :</h4>
                  <p><strong>Chambre :</strong> {rooms.find(r => r.value === formData.room)?.label}</p>
                  <p><strong>Du :</strong> {new Date(formData.checkIn).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Au :</strong> {new Date(formData.checkOut).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Nombre de nuits :</strong> {calculateNights()}</p>
                  <p><strong>Total estimé :</strong> {calculateTotal()}€</p>
                </div>
                <p className="redirect-info">Vous allez être redirigé vers l'accueil dans quelques secondes...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      {/* En-tête */}
      <section className="reservation-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h1 className="page-title">
                {isRoomLocked && formData.room 
                  ? `Réservation - ${rooms.find(r => r.value === formData.room)?.label}`
                  : 'Réservation'
                }
              </h1>
              <p className="page-subtitle">
                {isRoomLocked && formData.room
                  ? 'Finalisez votre réservation pour cette chambre'
                  : 'Réservez votre séjour à La Cachette'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de réservation */}
      <section className="reservation-form-section">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="form-container">
                <form onSubmit={handleSubmit} className="reservation-form">
                  
                  {/* Informations personnelles */}
                  <div className="form-section">
                    <h3>Informations personnelles</h3>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label">Prénom *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">Nom *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Téléphone</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Détails de la réservation */}
                  <div className="form-section">
                    <h3>Détails de la réservation</h3>
                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="room" className="form-label">
                          Chambre * 
                          {isRoomLocked && (
                            <span className="text-muted"> (Pré-sélectionnée depuis la page de la chambre)</span>
                          )}
                        </label>
                        {isRoomLocked ? (
                          <div className="locked-room-display">
                            <input
                              type="text"
                              className="form-control"
                              value={rooms.find(r => r.value === formData.room)?.label + ' - ' + rooms.find(r => r.value === formData.room)?.price + '€/nuit'}
                              disabled
                              style={{ backgroundColor: '#f8f9fa', border: '2px solid #8b7355' }}
                            />
                            <input type="hidden" name="room" value={formData.room} />
                            <small className="text-muted mt-1">
                              Cette chambre a été sélectionnée automatiquement. 
                              <button 
                                type="button" 
                                className="btn btn-link btn-sm p-0 ms-1"
                                onClick={() => {
                                  setIsRoomLocked(false);
                                  setFormData(prev => ({ ...prev, room: '' }));
                                }}
                              >
                                Changer de chambre
                              </button>
                            </small>
                          </div>
                        ) : (
                          <select
                            className="form-control"
                            id="room"
                            name="room"
                            value={formData.room}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Sélectionnez une chambre</option>
                            {rooms.map(room => (
                              <option key={room.value} value={room.value}>
                                {room.label} - {room.price}€/nuit
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="checkIn" className="form-label">Date d'arrivée *</label>
                        <input
                          type="date"
                          className="form-control"
                          id="checkIn"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="checkOut" className="form-label">Date de départ *</label>
                        <input
                          type="date"
                          className="form-control"
                          id="checkOut"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    {/* Message de vérification de disponibilité */}
                    {availabilityChecking && (
                      <div className="alert alert-info mt-3">
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Vérification de la disponibilité...
                      </div>
                    )}

                    {/* Message d'erreur de disponibilité */}
                    {availabilityError && (
                      <div className="alert alert-warning mt-3">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {availabilityError}
                      </div>
                    )}

                    {/* Message de disponibilité confirmée */}
                    {formData.room && formData.checkIn && formData.checkOut && 
                     !availabilityChecking && !availabilityError && (
                      <div className="alert alert-success mt-3">
                        <i className="fas fa-check-circle me-2"></i>
                        Parfait ! Cette chambre est disponible pour ces dates.
                      </div>
                    )}

                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="guests" className="form-label">Nombre de voyageurs</label>
                        <select
                          className="form-control"
                          id="guests"
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                        >
                          <option value={1}>1 personne</option>
                          <option value={2}>2 personnes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Résumé du prix */}
                  {formData.room && formData.checkIn && formData.checkOut && calculateNights() > 0 && (
                    <div className="price-summary">
                      <h4>Résumé</h4>
                      <div className="price-details">
                        <div className="price-line">
                          <span>Chambre sélectionnée :</span>
                          <span>{rooms.find(r => r.value === formData.room)?.label}</span>
                        </div>
                        <div className="price-line">
                          <span>Nombre de nuits :</span>
                          <span>{calculateNights()}</span>
                        </div>
                        <div className="price-line">
                          <span>Prix par nuit :</span>
                          <span>{rooms.find(r => r.value === formData.room)?.price}€</span>
                        </div>
                        <div className="price-line total">
                          <span><strong>Total estimé :</strong></span>
                          <span><strong>{calculateTotal()}€</strong></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message supplémentaire */}
                  <div className="form-section">
                    <label htmlFor="message" className="form-label">Message (optionnel)</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Demandes spéciales, questions..."
                    ></textarea>
                  </div>

                  {/* Erreur */}
                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}

                  {/* Boutons */}
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate(-1)}
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || availabilityChecking || !!availabilityError}
                    >
                      {loading ? 'Envoi en cours...' : 
                       availabilityChecking ? 'Vérification...' :
                       availabilityError ? 'Dates non disponibles' :
                       'Confirmer la réservation'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container-fluid">
          <nav className="footer-nav">
            <a href="#" className="footer-link">Avis</a>
            <a href="#" className="footer-link">Fiabilité</a>
            <a href="#" className="footer-link">Accueil &gt;</a>
            <a href="#" className="footer-link">Hôtes</a>
            <a href="#" className="footer-link">A propos</a>
            <a href="#" className="footer-link">Mentions légales</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default ReservationPage;
