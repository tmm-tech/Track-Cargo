// services/activityService.js
import axios from 'axios';

const API_BASE_URL = 'https://track-cargo.onrender.com/activity'; // your backend base URL

export const addActivity = async (activityData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, activityData);
    return response.data;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

// Get all activities
export async function getActivities() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Get activity by ID (optional, if needed)
export async function getActivityById(activityId) {
  try {
    const response = await axios.get(`${API_URL}/${activityId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Helper function to handle errors
function handleError(error) {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  console.error('ActivityService Error:', message);
  throw new Error(message);
}