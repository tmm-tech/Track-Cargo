// services/activityService.js
import axios from 'axios';

const API_BASE_URL = 'https://track-cargo.onrender.com/activity'; // your backend base URL

// https://www.texmonlogistics.co.ke/backend/activity
// https://track-cargo.onrender.com/activity
// Create a new location
export default {

  addActivity(activityData) {

    return axios.post(`${API_BASE_URL}/`, activityData);

  },

  // Get all activities
  getActivities() {

    return axios.get(API_BASE_URL);

  },

  // Get activity by ID (optional, if needed)
  getActivityById(activityId) {

    return axios.get(`${API_BASE_URL}/${activityId}`);


  },
};