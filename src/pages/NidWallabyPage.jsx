import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import roomsService from '../services/roomsService';
import '../../styles/NidWallabyPage.css';

const NidWallabyPage = () => {
  // Hook pour la navigation
  const navigate = useNavigate();
  
  // États pour gérer les données de la chambre
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de base pour les images
  const IMAGE_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/', '') || 'http://localhost:3000';
  
  // Fonction pour construire l'URL complète de l'image
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${IMAGE_BASE_URL}/uploads/${imageUrl}`;
  };

  // Fonction pour récupérer les données de la chambre "Le Nid du Wallaby"
  const fetchRoomData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await roomsService.getRooms();
      const rooms = response.data;
      
      // Chercher la chambre "Le Nid du Wallaby"
      const nidWallabyRoom = rooms.find(room => 
        room.room_name === "Le Nid du Wallaby"
      );
      
      if (nidWallabyRoom) {
        setRoomData(nidWallabyRoom);
      } else {
        setError("Chambre 'Le Nid du Wallaby' non trouvée");
      }
      
    } catch (err) {
      setError(`Erreur lors de la récupération des données: ${err.message}`);
      console.error('Erreur lors de la récupération de la chambre:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les données au chargement du composant
  useEffect(() => {
    fetchRoomData();
  }, []);

  // Images pour le carousel - utiliser l'image de l'API + images supplémentaires
  const getRoomImages = () => {
    const images = [];
    
    // Ajouter l'image principale de l'API si disponible
    if (roomData?.image_url) {
      const apiImage = getImageUrl(roomData.image_url);
      if (apiImage) {
        images.push(apiImage);
      }
    }
    
    // Ajouter des images supplémentaires (placeholder pour l'instant)
    // Ces images seront remplacées par de vraies images plus tard
    const additionalImages = [
      '/api/images/nid-wallaby-2.jpg',
      '/api/images/nid-wallaby-3.jpg',
      '/api/images/nid-wallaby-4.jpg'
    ];
    
    images.push(...additionalImages);
    
    // Filtrer les images null ou undefined
    return images.filter(img => img != null);
  };

  const services = [
    {
      image: null, // Espace réservé pour l'image du petit déjeuner
      title: 'Petit déjeuner',
      description: 'Petit déjeuner continental servi de 7h à 10h avec spécialités du Nord et produits locaux'
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
      description: 'Bain nordique chauffé au feu de bois avec vue sur la campagne du Nord-Pas-de-Calais'
    }
  ];

  const nearbyAttractions = [
    {
      name: 'Mémorial de Vimy',
      distance: '15 min',
      description: 'Site historique majeur de la Première Guerre mondiale avec vue panoramique'
    },
    {
      name: 'Arras et ses places',
      distance: '25 min',
      description: 'Architecture flamande remarquable et patrimoine UNESCO'
    },
    {
      name: 'Beffroi de Douai',
      distance: '30 min',
      description: 'Patrimoine mondial UNESCO et symbole du Nord-Pas-de-Calais'
    },
    {
      name: 'Carrière Wellington',
      distance: '25 min',
      description: 'Musée souterrain unique retraçant l\'histoire de la Grande Guerre'
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
              <p className="room-subtitle">Une évasion nature dans le Nord-Pas-de-Calais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel d'images */}
      <section className="room-gallery">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement des images...</span>
                  </div>
                  <p className="mt-2">Chargement des images...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center" role="alert">
                  <h5>Erreur de chargement</h5>
                  <p>{error}</p>
                  <button className="btn btn-outline-primary" onClick={fetchRoomData}>
                    Réessayer
                  </button>
                </div>
              ) : (
                <Carousel images={getRoomImages()} roomName="Le Nid du Wallaby" />
              )}
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
                <h2>Une expérience unique dans le Nord-Pas-de-Calais</h2>
                <p>
                  Située à Monchy-Le-Preux, petite commune chargée d'histoire, "Le Nid du Wallaby" vous offre un refuge 
                  authentique pour vous ressourcer loin de l'agitation urbaine. Cette chambre spacieuse de 35m² allie confort 
                  moderne et charme rustique avec ses poutres apparentes et sa décoration soignée 
                  inspirée de l'Australie.
                </p>
                <p>
                  Profitez d'un lit queen size ultra-confortable, d'une salle de bain privative 
                  avec douche à l'italienne, et d'un coin salon avec vue sur la campagne nordiste 
                  environnante. La terrasse privative vous permettra de savourer votre café matinal 
                  en admirant les paysages vallonnés typiques de la région.
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

      {/* Services disponibles */}
      <section className="room-services">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center">Services disponibles</h2>
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
                  <button className="booking-btn" onClick={() => navigate('/reservation?room=nid-wallaby')}>
                    Réserver
                  </button>
                </div>
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

export default NidWallabyPage;
