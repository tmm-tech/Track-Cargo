// services/packageService.js
import axios from 'axios';

const API_URL = 'https://www.texmonlogistics.co.ke/backend/package';

export default {
  // Create a new package
  addPackage(packageData) {
    return axios.post(`${API_URL}/packages`, packageData, );
  },

  // Fetch all packages
  getPackages() {
    return axios.get(`${API_URL}/packages`);
  },

  // Fetch a package by ID
  getPackageById(packageId) {
    return axios.get(`${API_URL}/packages/${packageId}`);
  },

  // Update a package
  updatePackage(packageId, updatedData) {
    return axios.put(`${API_URL}/packages/${packageId}`, updatedData);
  },

  // Delete a package
  deletePackage(packageId) {
    return axios.delete(`${API_URL}/packages/${packageId}`);
  },


  // Track a package by tracking number (public route)
  trackPackage(trackingNumber) {
    return axios.get(`${API_URL}/track/${trackingNumber}`);
  },

    // Cargo status
  StatusPackage() {
    return axios.get(`${API_URL}/packages/status-summary`);
  }
  
};














































































































































































































































