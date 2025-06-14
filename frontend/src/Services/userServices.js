// src/services/userServices.js
import axios from 'axios';

const API_BASE = 'https://track-cargo.onrender.com/users';

export default {
    // Login user
   async login(userData) {
        return await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include' // Include cookies with the request
      });
    },

    // Fetch all users
    getAllUsers() {
        return axios.get(`${API_BASE}/allusers/`);
    },

    // Fetch a specific user by ID
    getUserById(id) {
        return axios.get(`${API_BASE}/user/${id}`);
    },

    // Register a new user
    registerUser(newUser) {
        return axios.post(`${API_BASE}/register`, newUser);
    },

    // Update a user
    updateUser(id, updatedUser) {
        return axios.put(`${API_BASE}/update/${id}`, updatedUser);
    },

    // Delete a user
    deleteUser(id) {
        return axios.delete(`${API_BASE}/delete/${id}`);
    },

    // Activate a user
    activateUser(id) {
        return axios.put(`${API_BASE}/activate/${id}`);
    },
    // Forgot password
    forgotPassword(email) {
        return axios.post(`${API_BASE}/forgotpassword`, { email });
    },

    // Logout user
    logout(email) {
        return axios.post(`${API_BASE}/logout/${email}`);
    },

};
