// services/packageService.js
import axios from 'axios';

const API_URL = 'https://track-cargo.onrender.com/package'; // Change if your backend route is different

// Create a new package
export default {

  addPackage(packageData) {

    return axios.post(API_URL, packageData);

  },

  // Fetch all packages
  getPackages() {

    return axios.get(API_URL);

  },

  // Fetch a package by ID
  getPackageById(packageId) {

    return axios.get(`${API_URL}/${packageId}`);

  },

  // Update a package
  updatePackage(packageId, updatedData) {

    return axios.put(`${API_URL}/${packageId}`, updatedData);

  },

  // Delete a package
  deletePackage(packageId) {

    return axios.delete(`${API_URL}/${packageId}`);

  },

  // Track a package by tracking number
  trackPackage(trackingNumber) {

    return axios.get(`${API_URL}/track/${trackingNumber}`);

  },

};
