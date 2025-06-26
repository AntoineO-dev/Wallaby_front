import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


function getRooms() {
  return axios.get(API_URL + "rooms");
}


function getAvailableRooms() {
  return axios.get(API_URL + "rooms/available");
}


function getRoomsAbovePrice(price_per_night) {
  return axios.get(API_URL + "rooms/pricesAbove/" + price_per_night);
}

function getRoomsBelowPrice(price_per_night) {
  return axios.get(API_URL + "rooms/pricesBelow/" + price_per_night);
}


function getRoomByName(room_name) {
  return axios.get(API_URL + "rooms/name/" + room_name);
}

function getRoomsByCapacity(capacity) {
  return axios.get(API_URL + "rooms/capacity/" + capacity);
}


function getRoomById(id) {
  return axios.get(API_URL + "rooms/" + id);
}


function createRoom(room) {
  return axios.post(API_URL + "rooms", room);
}


function updateRoom(room) {
  return axios.patch(API_URL + "rooms/" + room.id_room, room);
}

function deleteRoom(id) {
  return axios.delete(API_URL + "rooms/" + id);
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