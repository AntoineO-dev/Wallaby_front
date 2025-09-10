import apiClient from './apiClient';
import authService from './authService';

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
      // Validation des données d'entrée
      if (!reservationData.roomId || !reservationData.checkIn || !reservationData.checkOut) {
        throw new Error('Données de réservation incomplètes: chambre, dates d\'arrivée et de départ sont obligatoires');
      }

      // Récupérer l'utilisateur connecté
      const currentUser = authService.getUser();
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour faire une réservation');
      }

      // Être flexible avec la structure de l'ID utilisateur
      const userId = currentUser.id_customer || currentUser.id || currentUser.userId;
      if (!userId) {
        console.error('Structure utilisateur:', currentUser);
        throw new Error('ID utilisateur non trouvé. Veuillez vous reconnecter.');
      }

      // Adapter les données au format attendu par votre backend
      const backendData = {
        id_room: parseInt(reservationData.roomId),
        id_customer: parseInt(userId),
        check_in_date: reservationData.checkIn,
        check_out_date: reservationData.checkOut,
        guest_count: parseInt(reservationData.guests) || 1,
        total_cost: parseFloat(reservationData.totalPrice) || 0
      };

      console.log('🔍 Debug - Création réservation:', {
        'User connecté': currentUser,
        'User ID extrait': userId,
        'Données reçues': reservationData,
        'Données envoyées au backend': backendData
      });

      const response = await apiClient.post('/reservations', backendData);
      console.log('✅ Réservation créée avec succès:', response.data);
      
      if (!response || !response.data) {
        console.error('❌ Réponse du serveur vide ou malformée');
        throw new Error('Réponse du serveur invalide');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création de réservation:', {
        error,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
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
      // Essayer différents endpoints pour récupérer toutes les réservations
      const possibleEndpoints = [
        '/reservations/admin/all',
        '/admin/reservations',
        '/reservations/all',
        '/reservations'
      ];

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔄 Tentative endpoint toutes réservations: ${endpoint}`);
          const response = await apiClient.get(endpoint);
          console.log(`✅ Réservations récupérées avec endpoint ${endpoint}:`, response.data);
          
          let reservations;
          // Gérer différents formats de réponse
          if (response.data.success && response.data.reservations) {
            reservations = response.data.reservations;
          } else if (Array.isArray(response.data)) {
            reservations = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            reservations = response.data.data;
          } else {
            reservations = response.data;
          }
          
          // Log pour debug : afficher la structure d'une réservation
          if (reservations && reservations.length > 0) {
            console.log('🔍 Structure d\'une réservation:', reservations[0]);
            console.log('🔍 Champs de date disponibles:', {
              id: reservations[0].id || reservations[0].id_reservation,
              created_at: reservations[0].created_at,
              reservation_date: reservations[0].reservation_date,
              booking_date: reservations[0].booking_date,
              check_in_date: reservations[0].check_in_date,
              updated_at: reservations[0].updated_at
            });
            console.log('🔍 Données client disponibles:', {
              customer: reservations[0].customer,
              client: reservations[0].client,
              first_name: reservations[0].first_name,
              last_name: reservations[0].last_name,
              name: reservations[0].name,
              email: reservations[0].email,
              customer_name: reservations[0].customer_name
            });
            console.log('🔍 Données chambre disponibles:', {
              room: reservations[0].room,
              chambre: reservations[0].chambre,
              room_name: reservations[0].room_name,
              room_type: reservations[0].room_type,
              id_room: reservations[0].id_room,
              room_title: reservations[0].room_title
            });
          }
          
          return reservations;
        } catch (endpointError) {
          console.warn(`⚠️ Endpoint ${endpoint} non disponible:`, endpointError.response?.status);
          continue;
        }
      }
      
      // Si aucun endpoint ne fonctionne, retourner un tableau vide
      console.warn('⚠️ Aucun endpoint de réservations disponible');
      return [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des réservations admin:', error);
      throw new Error('Impossible de récupérer les réservations');
    }
  },

  // Récupérer les réservations d'un utilisateur spécifique
  getMyReservations: async () => {
    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        throw new Error('Utilisateur non connecté');
      }

      console.log('🔍 DEBUG - Utilisateur connecté complet:', JSON.stringify(currentUser, null, 2));

      const userId = currentUser.id_customer || currentUser.id || currentUser.customer_id;
      console.log('🔍 DEBUG getMyReservations - User ID extrait:', userId);
      console.log('🔍 DEBUG - Propriétés disponibles:', Object.keys(currentUser));

      if (!userId) {
        console.error('❌ Aucun ID utilisateur trouvé dans:', currentUser);
        throw new Error('ID utilisateur introuvable. Veuillez vous reconnecter.');
      }

      // PRIORITÉ 1: Essayer d'abord l'endpoint spécifique pour l'utilisateur connecté
      try {
        console.log('🎯 Tentative endpoint /reservations/my (utilisateur connecté)');
        const response = await apiClient.get('/reservations/my');
        console.log('✅ Succès avec /reservations/my:', response.data);
        
        let reservations = null;
        if (Array.isArray(response.data)) {
          reservations = response.data;
        } else if (response.data?.reservations && Array.isArray(response.data.reservations)) {
          reservations = response.data.reservations;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          reservations = response.data.data;
        }
        
        if (reservations) {
          console.log(`✅ ${reservations.length} réservation(s) récupérée(s) pour l'utilisateur connecté`);
          return reservations;
        }
      } catch (myEndpointError) {
        console.warn('⚠️ Endpoint /reservations/my non disponible:', myEndpointError.response?.status);
      }

      // PRIORITÉ 2: Essayer les endpoints avec ID utilisateur dans l'URL
      const specificEndpoints = [
        `/reservations/customer/${userId}`,
        `/reservations/user/${userId}`
      ];

      for (const endpoint of specificEndpoints) {
        try {
          console.log(`🔄 Tentative avec endpoint spécifique: ${endpoint}`);
          const response = await apiClient.get(endpoint);
          console.log(`✅ Succès avec endpoint ${endpoint}:`, response.data);
          
          let reservations = null;
          if (Array.isArray(response.data)) {
            reservations = response.data;
          } else if (response.data?.reservations && Array.isArray(response.data.reservations)) {
            reservations = response.data.reservations;
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            reservations = response.data.data;
          }
          
          if (reservations) {
            console.log(`✅ ${reservations.length} réservation(s) trouvée(s) avec ${endpoint}`);
            return reservations;
          }
        } catch (endpointError) {
          console.warn(`⚠️ Endpoint ${endpoint} erreur:`, endpointError.response?.status);
          continue;
        }
      }

      // PRIORITÉ 3: Essayer les endpoints avec paramètres de requête
      const queryEndpoints = [
        `/reservations?customer=${userId}`,
        `/reservations?id_customer=${userId}`,
        `/reservations?user_id=${userId}`
      ];

      for (const endpoint of queryEndpoints) {
        try {
          console.log(`🔄 Tentative avec endpoint query: ${endpoint}`);
          const response = await apiClient.get(endpoint);
          console.log(`✅ Succès avec endpoint ${endpoint}:`, response.data);
          
          let reservations = null;
          if (Array.isArray(response.data)) {
            reservations = response.data;
          } else if (response.data?.reservations && Array.isArray(response.data.reservations)) {
            reservations = response.data.reservations;
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            reservations = response.data.data;
          }
          
          if (reservations) {
            console.log(`✅ ${reservations.length} réservation(s) trouvée(s) avec ${endpoint}`);
            return reservations;
          }
        } catch (endpointError) {
          console.warn(`⚠️ Endpoint ${endpoint} erreur:`, endpointError.response?.status);
          continue;
        }
      }

      // DERNIER RECOURS: Si aucun endpoint spécifique ne fonctionne, essayer l'endpoint général et filtrer
      console.log('⚠️ DERNIER RECOURS: Récupération de toutes les réservations pour filtrage local...');
      try {
        const response = await apiClient.get('/reservations');
        console.log('📊 Toutes les réservations récupérées:', response.data);
        
        // Analyser le format de réponse pour l'endpoint général
        let allReservations = null;
        
        if (Array.isArray(response.data)) {
          allReservations = response.data;
        } else if (response.data && response.data.reservations && Array.isArray(response.data.reservations)) {
          allReservations = response.data.reservations;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          allReservations = response.data.data;
        } else {
          console.warn('⚠️ Format de réponse général inattendu:', response.data);
          return [];
        }

        console.log(`📊 Total de ${allReservations.length} réservations dans la base`);

        // IMPORTANTE VÉRIFICATION: Afficher la structure d'une réservation pour debug
        if (allReservations.length > 0) {
          console.log('🔍 Structure d\'une réservation exemple:', allReservations[0]);
          console.log('🔍 Champs ID disponibles:', {
            id_customer: allReservations[0].id_customer,
            customerId: allReservations[0].customerId,
            userId: allReservations[0].userId,
            customer_id: allReservations[0].customer_id,
            id_user: allReservations[0].id_user
          });
        }

        console.log(`🎯 FILTRAGE: Recherche des réservations pour l'utilisateur ID: ${userId} (type: ${typeof userId})`);

        const myReservations = allReservations.filter(reservation => {
          // Extraire l'ID du client de la réservation
          const reservationUserId = reservation.id_customer || reservation.customerId || reservation.userId || reservation.customer_id || reservation.id_user;
          
          console.log(`🔍 Comparaison réservation ID ${reservation.id || reservation.id_reservation}:`);
          console.log(`   - Réservation User ID: "${reservationUserId}" (type: ${typeof reservationUserId})`);
          console.log(`   - User connecté ID: "${userId}" (type: ${typeof userId})`);
          
          // Convertir en string pour comparaison fiable
          const reservationUserIdStr = String(reservationUserId);
          const userIdStr = String(userId);
          
          const isMatch = reservationUserIdStr === userIdStr;
          console.log(`   - Match: ${isMatch}`);
          
          return isMatch;
        });
        
        console.log(`✅ RÉSULTAT FILTRAGE: ${myReservations.length} réservation(s) trouvée(s) pour l'utilisateur ${userId}`);
        if (myReservations.length > 0) {
          console.log('🔍 Réservations filtrées de l\'utilisateur:', myReservations);
        } else {
          console.log('⚠️ Aucune réservation trouvée après filtrage. Vérifiez les IDs.');
        }
        return myReservations;
      } catch (generalError) {
        console.error('❌ Endpoint général également inaccessible:', {
          status: generalError.response?.status,
          message: generalError.response?.data?.message || generalError.message,
          data: generalError.response?.data
        });
        if (generalError.response?.status === 403) {
          return [];
        }
        throw new Error('Impossible d\'accéder aux réservations. Veuillez contacter le support.');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des réservations:', error);
      if (error.response?.status === 404 || error.response?.status === 403) {
        console.log('ℹ️ Pas de réservations disponibles (404/403) - retour liste vide');
        return [];
      }
      throw new Error('Impossible de récupérer les réservations');
    }
  },

  // Récupérer les statistiques des réservations (pour admin)
  getReservationStats: async () => {
    try {
      // Essayer différents endpoints possibles pour les statistiques
      const possibleStatsEndpoints = [
        '/reservations/admin/stats',
        '/reservations/stats',
        '/admin/reservations/stats'
      ];

      for (const endpoint of possibleStatsEndpoints) {
        try {
          console.log(`🔄 Tentative endpoint stats: ${endpoint}`);
          const response = await apiClient.get(endpoint);
          console.log(`✅ Stats récupérées avec endpoint ${endpoint}:`, response.data);
          return response.data;
        } catch (endpointError) {
          console.warn(`⚠️ Endpoint stats ${endpoint} non disponible:`, endpointError.response?.status);
          continue;
        }
      }

      // Si aucun endpoint de stats ne fonctionne, calculer les stats basiques depuis les réservations
      console.log('📊 Calcul des statistiques à partir des réservations existantes...');
      try {
        const reservations = await this.getAllReservations();
        
        const stats = {
          totalReservations: reservations.length,
          totalRevenue: reservations.reduce((sum, res) => sum + (parseFloat(res.total_cost) || 0), 0),
          averageStay: reservations.length > 0 ? 
            reservations.reduce((sum, res) => {
              const checkIn = new Date(res.check_in_date);
              const checkOut = new Date(res.check_out_date);
              const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
              return sum + nights;
            }, 0) / reservations.length : 0,
          occupancyRate: 0 // Difficile à calculer sans info sur les chambres
        };
        
        console.log('📊 Statistiques calculées:', stats);
        return stats;
      } catch (reservationError) {
        console.warn('⚠️ Impossible de récupérer les réservations pour calculer les stats');
      }
      
      // Retourner des statistiques par défaut en dernier recours
      return {
        totalReservations: 0,
        totalRevenue: 0,
        averageStay: 0,
        occupancyRate: 0
      };
    } catch (error) {
      console.error('❌ Erreur générale lors de la récupération des statistiques:', error);
      // Retourner des statistiques par défaut en cas d'erreur
      return {
        totalReservations: 0,
        totalRevenue: 0,
        averageStay: 0,
        occupancyRate: 0
      };
    }
  },

  // Confirmer une réservation (pour admin)
  confirmReservation: async (reservationId) => {
    try {
      console.log(`🔄 Confirmation réservation ${reservationId}`);
      
      const token = authService.getToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await apiClient.post(`/reservations/${reservationId}/confirm`);

      console.log('✅ Réservation confirmée avec succès');
      return response.data;

    } catch (error) {
      console.error('❌ Erreur lors de la confirmation:', error);
      
      // Gestion spécifique des erreurs
      if (error.response?.status === 401) {
        throw new Error('Vous devez être connecté pour confirmer une réservation');
      }
      if (error.response?.status === 403) {
        throw new Error('Vous n\'êtes pas autorisé à confirmer cette réservation');
      }
      if (error.response?.status === 404) {
        throw new Error('Réservation non trouvée');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de la confirmation');
    }
  },

  // Mettre à jour le statut d'une réservation (pour admin)
  updateReservationStatus: async (reservationId, status) => {
    try {
      // Essayer différents endpoints possibles pour mettre à jour le statut
      const possibleEndpoints = [
        `/reservations/${reservationId}/status`,
        `/reservations/${reservationId}`,
        `/admin/reservations/${reservationId}/status`,
        `/admin/reservations/${reservationId}`
      ];

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`🔄 Tentative mise à jour statut avec endpoint: ${endpoint}`);
          
          let response;
          if (endpoint.includes('/status')) {
            response = await apiClient.put(endpoint, { status });
          } else {
            response = await apiClient.patch(endpoint, { status });
          }
          
          console.log(`✅ Statut mis à jour avec endpoint ${endpoint}:`, response.data);
          return response.data;
        } catch (endpointError) {
          console.warn(`⚠️ Endpoint statut ${endpoint} non disponible:`, endpointError.response?.status);
          continue;
        }
      }
      
      throw new Error('Aucun endpoint de mise à jour de statut disponible');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw new Error('Impossible de mettre à jour le statut de la réservation');
    }
  },

  // Annuler une réservation
  cancelReservation: async (reservationId, reason = '') => {
    try {
      console.log(`🔄 Annulation réservation ${reservationId}`);
      
      const token = authService.getToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await apiClient.patch(`/reservations/${reservationId}/cancel`, {
        reason
      });

      console.log('✅ Réservation annulée avec succès');
      return response.data;

    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation:', error);
      
      // Gestion spécifique des erreurs
      if (error.response?.status === 401) {
        throw new Error('Vous devez être connecté pour annuler une réservation');
      }
      if (error.response?.status === 403) {
        throw new Error('Vous n\'êtes pas autorisé à annuler cette réservation');
      }
      if (error.response?.status === 404) {
        throw new Error('Réservation non trouvée');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  }
};

export default reservationService;