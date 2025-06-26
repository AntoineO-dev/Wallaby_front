import React, { useState, useEffect } from 'react';
import '../../styles/HomePage.css';
import RoomCard from '../components/roomCard';
import roomsService from '../services/roomsService';

const HomePage = () => {
  // État pour stocker les données des chambres
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les données de l'API avec Axios
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Appel à l'API avec Axios
      const response = await roomsService.getRooms();
      setRooms(response.data);
      
    } catch (err) {
      setError(`Erreur lors de la récupération des chambres: ${err.message}`);
      console.error('Erreur lors de la récupération des chambres:', err);
    } finally {
      setLoading(false);
    }
  };

  // Appel API au chargement du composant
  useEffect(() => {
    fetchRooms();
  }, []);

  // Fonction pour gérer le clic sur "Voir chambres"
  const handleViewRooms = (roomId, roomTitle) => {
    console.log(`Voir chambres ${roomTitle} (ID: ${roomId})`);
   
  };
  return (
    <div className="homepage">
     
      
      {/* Section Hero avec image de fond */}
      <section className="hero-section">
        <div className="hero-image-placeholder"></div>
        <div className="hero-content">
          <h1>La Cachette</h1>
          <h2>Sautillante</h2>
        </div>
      </section>

      {/* Section Nature et bien-être */}
      <section className="nature-section">
        <div className="container-fluid">
          <h2 className="section-title text-center">Nature et bien-être</h2>
          
          {/* Cartes des chambres avec images d'illustration au-dessus */}
          <div className="row g-4 justify-content-center">
            {loading ? (
              // Affichage pendant le chargement
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des chambres...</p>
              </div>
            ) : error ? (
              // Affichage en cas d'erreur
              <div className="col-12 text-center">
                <div className="alert alert-danger" role="alert">
                  <h4>Erreur de chargement</h4>
                  <p>{error}</p>
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={fetchRooms}
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : rooms.length > 0 ? (
              // Affichage des chambres avec images au-dessus
              rooms.map((room) => (
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-4" key={room.id_room}>
                  {/* Image d'illustration au-dessus de chaque carte */}
                  <div className="nature-image-placeholder"></div>
                  
                  {/* Utilisation du composant RoomCard */}
                  <RoomCard 
                    room={room}
                    onViewRooms={() => handleViewRooms(room.id_room, room.room_name)}
                  />
                </div>
              ))
            ) : (
              // Affichage si aucune chambre n'est trouvée
              <div className="col-12 text-center">
                <p>Aucune chambre disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section About */}
      <section className="about-section">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-center g-4">
            <div className="col-md-auto text-center">
              <div className="logo-placeholder mx-auto"></div>
            </div>
            <div className="col-md-6">
              <div className="about-content">
                <h3>MUTIC DUDONT</h3>
                <p>Aenean est elit, egestas eu sem, euismod quis, tristique augue, radiatores.</p>
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

export default HomePage;