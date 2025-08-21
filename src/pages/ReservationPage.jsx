import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ReservationPage.css';

const ReservationPage = () => {
  const navigate = useNavigate();
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    room: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

    try {
      // Simulation d'envoi (remplace par ton API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      console.log('Réservation soumise:', formData);
      
      // Redirection après succès
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      setError('Erreur lors de l\'envoi de la réservation. Veuillez réessayer.');
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
              <h1 className="page-title">Réservation</h1>
              <p className="page-subtitle">Réservez votre séjour à La Cachette</p>
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
                        <label htmlFor="room" className="form-label">Chambre *</label>
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
                      disabled={loading}
                    >
                      {loading ? 'Envoi en cours...' : 'Confirmer la réservation'}
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
