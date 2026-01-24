const CustomerRoutes = require('express').Router();
const { createCustomer, getCustomers, getCustomerById,updateCustomer, deactivateCustomer} = require('../controllers/CustomerController');

CustomerRoutes.post('/', createCustomer);
CustomerRoutes.get('/', getCustomers);
CustomerRoutes.get('/:id', getCustomerById);
CustomerRoutes.put('/:id', updateCustomer);
CustomerRoutes.put('/:id/deactivate', deactivateCustomer);


module.exports = CustomerRoutes;