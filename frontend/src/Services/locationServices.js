// services/locationService.js
import axios from 'axios';

const API_URL = 'https://www.texmonlogistics.co.ke/backend/location'; // Update to match your backend

// Create a new location
export default {

  addLocation(locationData) {

    return axios.post(API_URL, locationData);

  },

  // Get all locations
  getLocations() {

    return axios.get(API_URL);

  },

  // Get a single location by ID
  getLocationById(id) {

    return axios.get(`${API_URL}/${id}`);

  },

  // Update a location
  updateLocation(locationId, locationData) {
    return axios.put(`${API_URL}/${locationId}`, locationData);

  },

  // Delete a location
  deleteLocation(locationId) {

    return axios.delete(`${API_URL}/${locationId}`);

  }
};
