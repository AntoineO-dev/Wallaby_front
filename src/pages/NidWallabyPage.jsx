import React from 'react';
import Carousel from '../components/Carousel';
import '../../styles/NidWallabyPage.css';

const NidWallabyPage = () => {
  // Images pour le carousel (en utilisant l'image existante et quelques autres exemples)
  const roomImages = [
    '/api/images/nid-wallaby-1.jpg', // Image principale depuis la base de données
    '/api/images/nid-wallaby-2.jpg', // Images supplémentaires
    '/api/images/nid-wallaby-3.jpg',
    '/api/images/nid-wallaby-4.jpg'
  ];

  const services = [
    {
      image: null, // Espace réservé pour l'image du petit déjeuner
      title: 'Petit déjeuner',
      description: 'Petit déjeuner continental servi de 7h à 10h avec produits locaux et bio'
    },
    {
      image: null, // Espace réservé pour l'image de la pétanque
      title: 'Pétanque',
      description: 'Terrain de pétanque privatif avec boules fournies pour des moments conviviaux'
    },
    {
      image: null, // Espace réservé pour l'image du sauna
      title: 'Sauna',
      description: 'Sauna finlandais traditionnel pour une détente absolue après vos activités'
    },
    {
      image: null, // Espace réservé pour l'image du bain nordique
      title: 'Bain nordique',
      description: 'Bain nordique chauffé au feu de bois avec vue sur la nature environnante'
    }
  ];

  const nearbyAttractions = [
    {
      name: 'Château de Chambord',
      distance: '15 min',
      description: 'Magnifique château Renaissance au cœur de la Sologne'
    },
    {
      name: 'Forêt de Boulogne',
      distance: '5 min',
      description: 'Sentiers de randonnée et pistes cyclables dans un cadre naturel préservé'
    },
    {
      name: 'Marché de Romorantin',
      distance: '20 min',
      description: 'Marché traditionnel avec produits du terroir tous les mercredis et samedis'
    },
    {
      name: 'Étangs de Sologne',
      distance: '10 min',
      description: 'Observation de la faune et pêche dans un environnement paisible'
    }
  ];

  return (
    <div className="nid-wallaby-page">
      {/* En-tête de la chambre */}
      <section className="room-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h1 className="room-title">Le Nid du Wallaby</h1>
              <p className="room-subtitle">Une évasion nature au cœur de la Sologne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel d'images */}
      <section className="room-gallery">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <Carousel images={roomImages} roomName="Le Nid du Wallaby" />
            </div>
          </div>
        </div>
      </section>

      {/* Description de la chambre */}
      <section className="room-description">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="description-content">
                <h2>Une expérience unique en Sologne</h2>
                <p>
                  Nichée au cœur de la nature solognote, "Le Nid du Wallaby" vous offre un refuge 
                  authentique pour vous ressourcer. Cette chambre spacieuse de 35m² allie confort 
                  moderne et charme rustique avec ses poutres apparentes et sa décoration soignée 
                  inspirée de l'Australie.
                </p>
                <p>
                  Profitez d'un lit queen size ultra-confortable, d'une salle de bain privative 
                  avec douche à l'italienne, et d'un coin salon avec vue imprenable sur la forêt 
                  environnante. La terrasse privative vous permettra de savourer votre café matinal 
                  en écoutant le chant des oiseaux.
                </p>
                
                <div className="room-features">
                  <h3>Équipements de la chambre</h3>
                  <div className="features-grid">
                    <div className="feature-item">
                      <span className="feature-icon">🛏️</span>
                      <span>Lit Queen Size</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🚿</span>
                      <span>Salle de bain privée</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🌿</span>
                      <span>Terrasse privative</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📺</span>
                      <span>TV écran plat</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">☕</span>
                      <span>Coin café/thé</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🔥</span>
                      <span>Chauffage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services inclus */}
      <section className="room-services">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center">Services inclus</h2>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {services.map((service, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="service-card">
                  <div className="service-image-placeholder">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="service-image"
                      />
                    ) : (
                      <div className="service-image-empty">
                        <span>Image à venir</span>
                      </div>
                    )}
                  </div>
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attractions à proximité */}
      <section className="nearby-attractions">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center">À découvrir aux alentours</h2>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {nearbyAttractions.map((attraction, index) => (
              <div key={index} className="col-lg-6">
                <div className="attraction-card">
                  <div className="attraction-info">
                    <h4>{attraction.name}</h4>
                    <span className="distance">{attraction.distance}</span>
                  </div>
                  <p>{attraction.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="practical-info">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="info-content">
                <h2>Informations pratiques</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <h4>Arrivée</h4>
                    <p>À partir de 15h00</p>
                  </div>
                  <div className="info-item">
                    <h4>Départ</h4>
                    <p>Avant 11h00</p>
                  </div>
                  <div className="info-item">
                    <h4>Capacité</h4>
                    <p>2 personnes maximum</p>
                  </div>
                  <div className="info-item">
                    <h4>Tarif</h4>
                    <p>À partir de 120€/nuit</p>
                  </div>
                </div>
                
                <div className="booking-section">
                  <h3>Réservez votre séjour</h3>
                  <p>Contactez-nous pour vérifier les disponibilités et effectuer votre réservation.</p>
                  <button className="booking-btn">
                    Vérifier les disponibilités
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NidWallabyPage;
