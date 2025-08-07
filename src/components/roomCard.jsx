import React from 'react';

const RoomCard = ({ room, onViewRooms }) => {
  
  // Fonction pour gérer le clic sur le bouton
  const handleClick = () => {
    if (onViewRooms) {
      onViewRooms();
    }
  };

  // URL de base pour les images (à ajuster selon votre configuration backend)
  const IMAGE_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api/', '') || 'http://localhost:3000';
  
  // Fonction pour construire l'URL complète de l'image
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // Si l'URL est déjà complète, la retourner telle quelle
    if (imageUrl.startsWith('http')) return imageUrl;
    // Sinon, construire l'URL complète
    return `${IMAGE_BASE_URL}/uploads/${imageUrl}`;
  };

  return (
    <div className="room-card h-100">
      {/* Image de la chambre */}
      {room.image_url && (
        <div className="room-image-container">
          <img 
            src={getImageUrl(room.image_url)} 
            alt={room.room_name || "Image de la chambre"}
            className="room-image"
            onError={(e) => {
              // Image de fallback en cas d'erreur
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="room-image-placeholder" style={{display: 'none'}}>
            🏠
          </div>
        </div>
      )}
      
      <div className="room-content">
        <h3>{room.room_name || "Titre non disponible"}</h3>
        <p>{room.description || "Description non disponible"}</p>
        
        {/* Affichage optionnel du prix et de la capacité si disponibles */}
        {room.price_per_night && (
          <p className="room-price">{room.price_per_night}€ / nuit</p>
        )}
        {room.capacity && (
          <p className="room-capacity">Capacité: {room.capacity} personne(s)</p>
        )}
        
        <button 
          className="btn-voir-chambres"
          onClick={handleClick}
        >
          Voir chambres →
        </button>
      </div>
    </div>
  );
};

export default RoomCard;