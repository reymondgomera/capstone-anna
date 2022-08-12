const jwt = require('jsonwebtoken');
const config = require('../config/key');

module.exports = async (req, res, next) => {
   try {
      const jwtToken = req.header('token');
      if (!jwtToken) return res.status(401).json({ message: 'Not authorized!' });

      const payload = jwt.verify(jwtToken, config.jwt_secret);
      req.user = payload.user;
      next();
   } catch (err) {
      console.error(err.message);
      res.status(401).json({ message: 'Not authorized!' });
   }
};
