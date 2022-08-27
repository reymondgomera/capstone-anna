const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      age: {
         type: Number,
         required: true,
      },
      sex: {
         type: String,
         required: true,
      },
      strand: {
         type: String,
         required: true,
         uppercase: true,
      },
      riasec_code: {
         type: Schema.Types.Mixed,
         required: true,
      },
      riasec_course_recommendation: {
         type: [String],
         required: true,
      },
      strand_course_recommendation: {
         type: [String],
         required: true,
      },
   },
   { timestamps: { createdAt: true, updatedAt: false } }
);

const Conversation = mongoose.model('conversation', conversationSchema);
module.exports = Conversation;
