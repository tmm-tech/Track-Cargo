const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;

module.exports = {
      // Create a JWT Token
      createToken: (data) => {
            try {
                  const token = jwt.sign(data, secret, { expiresIn: '1h' }); // Token valid for 1 hour
                  return token;
            } catch (error) {
                  console.error(error);
                  return null;
            }
      },

      // Verify JWT Token
      verifyToken: (token) => {
            try {
                  const data = jwt.verify(token, secret);
                  return data;
            } catch (error) {
                  console.error('Token verification failed:', error);
                  return null;
            }
      },

      // Refresh JWT Token
      refreshToken: (token) => {
            try {
                  const data = jwt.verify(token, secret, { ignoreExpiration: true });
                  const newToken = jwt.sign({ email: data.email, id: data.id }, secret, { expiresIn: '1h' });
                  return newToken;
            } catch (error) {
                  console.error('Token refresh failed:', error);
                  return null;
            }
      }
};

