import React from 'react';

const RoomCard = ({ title, description, onViewRooms, room_id, price_per_night, capacity }) => {
  
  // Fonction pour gérer le clic sur le bouton
  const handleClick = () => {
    if (onViewRooms) {
      onViewRooms();
    }
  };

  return (
    <div className="col-lg-4 col-md-6">
      <div className="room-card">
        <h3>{title || "Titre non disponible"}</h3>
        <p>{description || "Description non disponible"}</p>
        
        {/* Affichage optionnel du prix et de la capacité si disponibles */}
        {price_per_night && (
          <p className="room-price">{price_per_night}€ / nuit</p>
        )}
        {capacity && (
          <p className="room-capacity">Capacité: {capacity} personne(s)</p>
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