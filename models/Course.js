const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         required: true,
         trim: true,
      },
      riasec_area: {
         type: [String],
         required: true,
      },
      strand: {
         type: [String],
         required: true,
      },
   },
   { timestamps: true }
);

const Course = mongoose.model('course', CourseSchema);
module.exports = Course;
