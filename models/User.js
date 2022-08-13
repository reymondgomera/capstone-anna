const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
   {
      email: {
         type: String,
         lowercase: true,
         required: true,
         trim: true,
         unique: true,
      },
      password: { type: String, required: true },
      role: String,
   },
   { timestamps: true }
);

const User = mongoose.model('user', userSchema);
module.exports = User;
