import React from 'react';

const RoomCard = ({ room, onViewRooms }) => {
  
  // Fonction pour gérer le clic sur le bouton
  const handleClick = () => {
    if (onViewRooms) {
      onViewRooms();
    }
  };

  return (
    <div className="room-card h-100">
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
  );
};

export default RoomCard;