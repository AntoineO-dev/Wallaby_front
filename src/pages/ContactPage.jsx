import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../styles/ContactPage.css';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredContact: 'email'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container h-100">
            <div className="row justify-content-center align-items-center h-100">
              <div className="col-lg-8 text-center">
                <h1 className="hero-title">
                  <i className="fas fa-envelope me-3"></i>
                  Contactez-nous
                </h1>
                <p className="hero-subtitle">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions 
                  et vous accompagner dans l'organisation de votre séjour parfait.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <div className="row">
          {/* Formulaire de contact */}
          <div className="col-lg-8 mb-5">
            <div className="contact-form-section">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-paper-plane me-2"></i>
                  Envoyez-nous un message
                </h2>
                <p className="section-subtitle">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              {submitStatus === 'success' && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Votre message a été envoyé avec succès ! Nous vous répondrons dans les 24h.
                  <button type="button" className="btn-close" onClick={() => setSubmitStatus(null)}></button>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
                  <button type="button" className="btn-close" onClick={() => setSubmitStatus(null)}></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      <i className="fas fa-user me-2"></i>Prénom *
                    </label>
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
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      <i className="fas fa-user me-2"></i>Nom *
                    </label>
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
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>Email *
                    </label>
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
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">
                      <i className="fas fa-phone me-2"></i>Téléphone
                    </label>
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

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    <i className="fas fa-tag me-2"></i>Sujet *
                  </label>
                  <select
                    className="form-select"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="reservation">Réservation</option>
                    <option value="information">Demande d'information</option>
                    <option value="services">Services additionnels</option>
                    <option value="modification">Modification de réservation</option>
                    <option value="annulation">Annulation</option>
                    <option value="reclamation">Réclamation</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="preferredContact" className="form-label">
                    <i className="fas fa-comment-dots me-2"></i>Moyen de contact préféré
                  </label>
                  <div className="form-check-group">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="preferredContact"
                        id="contactEmail"
                        value="email"
                        checked={formData.preferredContact === 'email'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="contactEmail">
                        <i className="fas fa-envelope me-1"></i>Email
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="preferredContact"
                        id="contactPhone"
                        value="phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="contactPhone">
                        <i className="fas fa-phone me-1"></i>Téléphone
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label">
                    <i className="fas fa-comment me-2"></i>Message *
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre demande en détail..."
                    required
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Envoyer le message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="col-lg-4">
            <div className="contact-info-section">
              <h3 className="info-title">
                <i className="fas fa-info-circle me-2"></i>
                Informations de contact
              </h3>

              <div className="contact-info-card">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h5>Adresse</h5>
                    <p>123 Rue de la Nature<br/>62118 Monchy-le-Preux<br/>France</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <h5>Téléphone</h5>
                    <p>+33 3 21 XX XX XX</p>
                    <small>Disponible 7j/7 de 8h à 20h</small>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h5>Email</h5>
                    <p>contact@wallaby-retreat.fr</p>
                    <small>Réponse sous 24h</small>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-details">
                    <h5>Horaires d'accueil</h5>
                    <p>Lun-Dim: 8h00 - 20h00</p>
                    <small>Check-in: 15h00 | Check-out: 11h00</small>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h5>Urgences 24h/24</h5>
                    <p>+33 6 XX XX XX XX</p>
                    <small>Numéro d'urgence pour les clients</small>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <h5>Suivez-nous</h5>
                <div className="social-buttons">
                  <a href="#" className="social-btn facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-btn instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-btn tripadvisor">
                    <i className="fab fa-tripadvisor"></i>
                  </a>
                  <a href="#" className="social-btn google">
                    <i className="fab fa-google"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="map-section">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-map-marked-alt me-2"></i>
                  Notre localisation
                </h2>
                <p className="section-subtitle">
                  Wallaby Retreat est situé à Monchy-le-Preux, dans un cadre naturel exceptionnel 
                  au cœur du Pas-de-Calais.
                </p>
                
                {/* Liens directs vers l'adresse */}
                <div className="address-links">
                  <div className="address-highlight">
                    <h4>
                      <i className="fas fa-map-pin me-2 text-danger"></i>
                      123 Rue de la Nature, 62118 Monchy-le-Preux
                    </h4>
                    <div className="map-links">
                      <a 
                        href="https://www.google.com/maps/search/123+Rue+de+la+Nature,+62118+Monchy-le-Preux,+France" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary me-2 mb-2"
                      >
                        <i className="fab fa-google me-1"></i>
                        Ouvrir dans Google Maps
                      </a>
                      <a 
                        href="https://maps.apple.com/?q=123+Rue+de+la+Nature,+62118+Monchy-le-Preux,+France" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary me-2 mb-2"
                      >
                        <i className="fas fa-map me-1"></i>
                        Plans Apple
                      </a>
                      <a 
                        href="https://waze.com/ul?q=123+Rue+de+la+Nature,+62118+Monchy-le-Preux,+France" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary mb-2"
                      >
                        <i className="fas fa-route me-1"></i>
                        Ouvrir dans Waze
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="map-container">
                <div className="map-info">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="location-info">
                        <h4>
                          <i className="fas fa-compass me-2"></i>
                          Accès facile
                        </h4>
                        <ul>
                          <li><i className="fas fa-car me-2"></i>Parking gratuit sur place</li>
                          <li><i className="fas fa-train me-2"></i>Gare d'Arras à 15 km</li>
                          <li><i className="fas fa-plane me-2"></i>Aéroport de Lille à 45 km</li>
                          <li><i className="fas fa-road me-2"></i>Autoroute A1 à 10 km</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="google-map">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5060.964347868665!2d2.8644093!3d50.2954076!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDE3JzQzLjUiTiAywrA1MSc1MS45IkU!5e0!3m2!1sfr!2sfr!4v1694000000000!5m2!1sfr!2sfr"
                          width="100%"
                          height="400"
                          style={{ border: 0, borderRadius: '15px' }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Wallaby Retreat - 123 Rue de la Nature, Monchy-le-Preux"
                        ></iframe>
                        
                        {/* Marqueur central rouge */}
                        <div className="map-center-marker">
                          <div className="center-pin">
                            <div className="pin-head">
                              <i className="fas fa-home"></i>
                            </div>
                            <div className="pin-tail"></div>
                          </div>
                          <div className="marker-label">Wallaby Retreat</div>
                        </div>
                        <div className="map-address-overlay">
                          <div className="address-card">
                            <div className="location-marker">
                              <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <h5>
                              <i className="fas fa-home me-2"></i>
                              Wallaby Retreat
                            </h5>
                            <p>123 Rue de la Nature<br/>62118 Monchy-le-Preux<br/>France</p>
                            <a 
                              href="https://www.google.com/maps/search/123+Rue+de+la+Nature,+62118+Monchy-le-Preux,+France" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-sm"
                            >
                              <i className="fas fa-directions me-1"></i>
                              Itinéraire
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="faq-section">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-question-circle me-2"></i>
                  Questions fréquentes
                </h2>
                <p className="section-subtitle">
                  Trouvez rapidement les réponses aux questions les plus courantes.
                </p>
              </div>

              <div className="faq-accordion">
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                        <i className="fas fa-clock me-2"></i>
                        Quels sont les horaires de check-in et check-out ?
                      </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Le check-in s'effectue à partir de 15h00 et le check-out avant 11h00. 
                        Des arrangements peuvent être pris pour des arrivées tardives ou des départs anticipés.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                        <i className="fas fa-paw me-2"></i>
                        Acceptez-vous les animaux de compagnie ?
                      </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Oui, nous accueillons vos compagnons à quatre pattes moyennant un supplément de 15€ par nuit. 
                        Merci de nous prévenir lors de votre réservation.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                        <i className="fas fa-car me-2"></i>
                        Le parking est-il inclus ?
                      </button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Oui, le parking est gratuit et inclus dans votre séjour. 
                        Nous disposons de places sécurisées directement sur la propriété.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                        <i className="fas fa-times-circle me-2"></i>
                        Quelle est votre politique d'annulation ?
                      </button>
                    </h2>
                    <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Annulation gratuite jusqu'à 48h avant l'arrivée. Pour les annulations dans les 48h, 
                        des frais équivalent à une nuit peuvent s'appliquer selon les conditions de réservation.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
