// services/locationService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/locations'; // Update to match your backend

// Create a new location
export async function addLocation(locationData) {
  try {
    const response = await axios.post(API_URL, locationData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Get all locations
export async function getLocations() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Get a single location by ID
export async function getLocationById(locationId) {
  try {
    const response = await axios.get(`${API_URL}/${locationId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Update a location
export async function updateLocation(locationId, locationData) {
  try {
    const response = await axios.put(`${API_URL}/${locationId}`, locationData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Delete a location
export async function deleteLocation(locationId) {
  try {
    const response = await axios.delete(`${API_URL}/${locationId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Central error handler
function handleError(error) {
  const message = error.response?.data?.message || error.message || 'Unexpected error';
  console.error('LocationService Error:', message);
  throw new Error(message);
}
