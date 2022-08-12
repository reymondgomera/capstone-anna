const jwt = require('jsonwebtoken');
const config = require('../config/key');

const jwtGenerator = id => {
   const payload = {
      user: id,
   };

   return jwt.sign(payload, config.jwt_secret, { expiresIn: '12hr' });
};

module.exports = jwtGenerator;
