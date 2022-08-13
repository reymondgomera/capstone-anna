const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema(
   {
      email: {
         type: String,
         lowercase: true,
         required: true,
         trim: true,
      },
      feedback: {
         type: String,
         required: true,
      },
   },
   { timestamps: { createdAt: true, updatedAt: false } }
);

const Feedback = mongoose.model('feedback', feedbackSchema);
module.exports = Feedback;
