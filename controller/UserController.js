const Conversation = require('../models/Conversation');
const Course = require('../models/Course');

const user_addConversations_post = async (req, res) => {
   try {
      const { name, age, sex, strand, riasec_code, riasec_course_recommendation, strand_course_recommendation } = req.body;
      const newConversation = new Conversation({
         name,
         age,
         sex,
         strand,
         riasec_code,
         riasec_course_recommendation,
         strand_course_recommendation,
      });
      const createdConversation = await newConversation.save();
      res.json({ conversation: createdConversation, message: 'Conversation created successfully!' });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const user_getCoursesByStrand_get = async (req, res) => {
   try {
      const { strand } = req.params;

      const courses = await Course.find({ strand: { $in: strand } }).sort({ name: 'asc' });
      const coursesNames = courses.map(course => course.name);
      res.json({ courses: coursesNames });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

module.exports = {
   user_addConversations_post,
   user_getCoursesByStrand_get,
};
