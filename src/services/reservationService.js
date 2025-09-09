import apiClient from './apiClient';

const reservationService = {
  // Vérifier la disponibilité d'une chambre
  checkRoomAvailability: async (roomId, checkInDate, checkOutDate) => {
    try {
      // Votre backend attend GET avec query params
      const response = await apiClient.get('/reservations/check-availability', {
        params: {
          room_id: roomId,
          check_in_date: checkInDate,
          check_out_date: checkOutDate
        }
      });
      
      // Adapter la réponse de votre backend au format attendu par le frontend
      return {
        isAvailable: response.data.available,
        conflictingReservations: response.data.conflicting_reservations || []
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      throw new Error('Impossible de vérifier la disponibilité');
    }
  },

  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    try {
      // Adapter les données au format attendu par votre backend
      const backendData = {
        id_room: reservationData.roomId,
        id_customer: 1, // Vous devrez gérer l'authentification plus tard
        check_in_date: reservationData.checkIn,
        check_out_date: reservationData.checkOut,
        // Le backend calculera automatiquement total_cost
        // Les autres données du formulaire (nom, email, etc.) devront être gérées séparément
        guest_info: {
          firstName: reservationData.firstName,
          lastName: reservationData.lastName,
          email: reservationData.email,
          phone: reservationData.phone,
          guests: reservationData.guests,
          message: reservationData.message
        }
      };

      const response = await apiClient.post('/reservations', backendData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de réservation:', error);
      
      // Gestion spécifique des erreurs de conflit (409)
      if (error.response?.status === 409) {
        throw new Error('Ces dates ne sont plus disponibles. Veuillez choisir d\'autres dates.');
      }
      
      // Gestion des erreurs de validation (400)
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Données de réservation invalides.');
      }
      
      throw new Error('Erreur lors de la réservation. Veuillez réessayer.');
    }
  },

  // Récupérer toutes les réservations (pour admin)
  getAllReservations: async () => {
    try {
      const response = await apiClient.get('/reservations');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      throw new Error('Impossible de récupérer les réservations');
    }
  },

  // Récupérer les réservations d'une chambre spécifique
  getReservationsByRoom: async (roomId) => {
    try {
      // Si votre backend a un endpoint spécifique pour les réservations par chambre
      // vous pouvez l'utiliser, sinon on filtre toutes les réservations
      const response = await apiClient.get('/reservations');
      const allReservations = response.data;
      
      // Filtrer par roomId
      const roomReservations = allReservations.filter(
        reservation => reservation.id_room === parseInt(roomId)
      );
      
      return roomReservations;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations de la chambre:', error);
      throw new Error('Impossible de récupérer les réservations de cette chambre');
    }
  },

  // Récupérer les chambres disponibles pour des dates données
  getAvailableRooms: async (checkInDate, checkOutDate) => {
    try {
      const response = await apiClient.get('/reservations/available-rooms', {
        params: {
          check_in_date: checkInDate,
          check_out_date: checkOutDate
        }
      });
      return response.data.rooms || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des chambres disponibles:', error);
      throw new Error('Impossible de récupérer les chambres disponibles');
    }
  },

  // Récupérer les statistiques de réservation
  getReservationStats: async () => {
    try {
      const response = await apiClient.get('/reservations/stats');
      return response.data.stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new Error('Impossible de récupérer les statistiques');
    }
  },

  // Annuler une réservation
  cancelReservation: async (reservationId, reason = '') => {
    try {
      const response = await apiClient.patch(`/reservations/${reservationId}/cancel`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      throw new Error('Impossible d\'annuler la réservation');
    }
  },

  // Confirmer une réservation
  confirmReservation: async (reservationId) => {
    try {
      const response = await apiClient.post(`/reservations/${reservationId}/confirm`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la confirmation de la réservation:', error);
      throw new Error('Impossible de confirmer la réservation');
    }
  }
};

export default reservationService;
