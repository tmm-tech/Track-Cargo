// services/packageService.js
import axios from 'axios';

const API_URL = 'https://track-cargo.onrender.com/package';

export default {
  // Create a new package
  addPackage(packageData) {
    return axios.post(`${API_URL}/packages`, packageData);
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

  // Search packages
  searchPackages(queryParams) {
    return axios.get(`${API_URL}/packages/search`, { params: queryParams });
  },

  // Get package statistics (admin/manager)
  getPackageStats() {
    return axios.get(`${API_URL}/packages/stats`);
  },

  // Export packages (admin/manager)
  exportPackages(queryParams) {
    return axios.get(`${API_URL}/packages/export`, {
      params: queryParams,
      responseType: 'blob', // If it's a file download
    });
  },

  // Add a tracking event to a package
  addTrackingEvent(packageId, trackingEventData) {
    return axios.post(`${API_URL}/packages/${packageId}/tracking`, trackingEventData);
  },

  // Bulk update packages
  bulkUpdatePackages(bulkData) {
    return axios.put(`${API_URL}/packages/bulk`, bulkData);
  },

  // Get detailed package timeline (tracking events + comments)
  getPackageTimeline(packageId) {
    return axios.get(`${API_URL}/packages/${packageId}/timeline`);
  },

  // Optional: Health check endpoint
  checkHealth() {
    return axios.get(`${API_URL}/health`);
  },

  // Optional: Get docs
  getDocs() {
    return axios.get(`${API_URL}/docs`);
  },
};