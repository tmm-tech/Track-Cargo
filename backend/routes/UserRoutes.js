const UserRoutes = require('express').Router();
const {
    createUser,  
    getAllUser,
    updateUser,
    SoftDeleteUser,
    loginUser,
    getAUser,
    Logout,
    checkAuth,
    forgotPassword,
    refreshUserStatus
} = require('../controllers/UserControllers');

// create and insert data into the table
UserRoutes.post('/register', createUser)
//read for all users
UserRoutes.get('/allusers', getAllUser)
//read for a specific id
UserRoutes.get('/user/:id', getAUser)
//soft delete item of a specific id
UserRoutes.put('/delete/:userId', SoftDeleteUser)
//activate user
UserRoutes.put('/activate/:userId', refreshUserStatus);
//update items
UserRoutes.put('/update/:id', updateUser)
// login a user
UserRoutes.post('/login', loginUser)
//Forgot Password 
UserRoutes.post('/forgotpassword', forgotPassword)
// logout user
UserRoutes.post('/logout/:email', Logout)
//authenticate
UserRoutes.get('/protected', checkAuth, (req, res) => {
    // Handle the request if authenticated
    res.json({ message: 'Access granted to protected route.' });
});
module.exports = UserRoutes
