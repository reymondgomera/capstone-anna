const User = require('../models/User');
const jwtGenerator = require('../utils/jwtGenerator');
const bcrypt = require('bcrypt');

const signup_post = async (req, res) => {
   try {
      //.lean() allows query to return plain javascript object, by default query returns mongoose document with its methods
      const { email, password } = req.body;
      const user = await User.findOne({ email }).lean();

      if (user) res.status(401).json({ message: 'User already exist!' });
      else {
         const saltRound = 10;
         const salt = await bcrypt.genSalt(saltRound);
         const bcryptPassword = await bcrypt.hash(password, salt);

         const newUser = new User({ email, password: bcryptPassword, role: 'user' });
         const createdUser = await newUser.save();

         const token = jwtGenerator(createdUser._id);
         res.json({ token, message: 'User signed up successfully!' });
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const signin_post = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).lean();

      if (!user) res.status(403).json({ message: 'Incorrect credentials!' });
      else {
         if (user.role === 'admin') {
            if (user.password === password) {
               const token = jwtGenerator(user._id);
               res.json({ token, message: 'User signed in successfully!' });
            } else res.status(403).json({ message: 'Incorrect credentials!' });
         } else {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword) {
               const token = jwtGenerator(user._id);
               res.json({ token, message: 'User signed in successfully!' });
            } else res.status(403).json({ message: 'Incorrect credentials!' });
         }
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const isVarify_get = (req, res) => {
   try {
      res.json(true);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

module.exports = {
   signup_post,
   signin_post,
   isVarify_get,
};
