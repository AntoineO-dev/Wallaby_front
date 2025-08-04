import apiClient from './apiClient.js';

// Fonctions pour récupérer les chambres
function getRooms() {
  return apiClient.get('rooms');
}

function getAvailableRooms() {
  return apiClient.get('rooms/available');
}

function getRoomsAbovePrice(price_per_night) {
  return apiClient.get('rooms/pricesAbove/' + price_per_night);
}

function getRoomsBelowPrice(price_per_night) {
  return apiClient.get('rooms/pricesBelow/' + price_per_night);
}

function getRoomByName(room_name) {
  return apiClient.get('rooms/name/' + room_name);
}

function getRoomsByCapacity(capacity) {
  return apiClient.get('rooms/capacity/' + capacity);
}

function getRoomById(id) {
  return apiClient.get('rooms/' + id);
}

function createRoom(room) {
  return apiClient.post('rooms', room);
}

function updateRoom(room) {
  return apiClient.patch('rooms/' + room.id_room, room);
}

function deleteRoom(id) {
  return apiClient.delete('rooms/' + id);
}

export default { 
  getRooms, 
  getAvailableRooms,
  getRoomsAbovePrice,
  getRoomsBelowPrice,
  getRoomByName,
  getRoomsByCapacity,
  getRoomById,
  createRoom, 
  updateRoom, 
  deleteRoom 
};