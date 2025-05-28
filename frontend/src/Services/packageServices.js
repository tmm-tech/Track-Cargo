// services/packageService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/packages'; // Change if your backend route is different

// Create a new package
export async function addPackage(packageData) {
  try {
    const response = await axios.post(API_URL, packageData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Fetch all packages
export async function getPackages() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Fetch a package by ID
export async function getPackageById(packageId) {
  try {
    const response = await axios.get(`${API_URL}/${packageId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Update a package
export async function updatePackage(packageId, updatedData) {
  try {
    const response = await axios.put(`${API_URL}/${packageId}`, updatedData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Delete a package
export async function deletePackage(packageId) {
  try {
    const response = await axios.delete(`${API_URL}/${packageId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Centralized error handler
function handleError(error) {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  console.error('PackageService Error:', message);
  throw new Error(message);
}
