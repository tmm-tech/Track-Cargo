// services/customerService.js
import axios from 'axios';

const API_URL = 'https://track-cargo.onrender.com/customer'; // Update to match your backend

// https://www.texmonlogistics.co.ke/backend/customer
// https://track-cargo.onrender.com/customer
export default {
    // Create a new customer
    addCustomer(customerData) {
        return axios.post(API_URL, customerData);
    },

    // Get all customers
    getCustomers() {
        return axios.get(API_URL);
    },
    // Get a single customer by ID
    getCustomerById(id) {
        return axios.get(`${API_URL}/${id}`);
    },
    // Update a customer
    updateCustomer(customerId, customerData) {
        return axios.put(`${API_URL}/${customerId}`, customerData);
    },

    // Delete a customer
    deleteCustomer(customerId) {
        return axios.delete(`${API_URL}/${customerId}/deactivate`);
    },
};