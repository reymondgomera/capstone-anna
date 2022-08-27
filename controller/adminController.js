const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const Conversation = require('../models/Conversation');

const admin_addFeedback_post = async (req, res) => {
   try {
      const { email, feedback } = req.body;
      const newFeedback = new Feedback({ email, feedback });
      const createdFeedback = await newFeedback.save();
      res.json({ feedback: createdFeedback.toObject(), message: 'Feedback created successfully!' });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_getFeedbacks_get = async (req, res) => {
   try {
      let { page, size, search, sort, order } = req.query;

      // set default page and size if queries are empty
      if (!page) page = 1;
      if (!size) size = 0;
      if (!search) search = '';
      if (!sort) sort = 'createdAt';
      if (!order) order = 'desc';

      const limit = parseInt(size);
      const skip = (parseInt(page) - 1) * size; // e.g. page = 2, size = 10 -> skip = 10
      let sortText = '';

      if (sort && order) sortText = order !== 'desc' ? sort : `-${sort}`; // with dash(-) means sort in descending

      const feedbacks = await Feedback.find({ email: { $regex: search, $options: 'i' } })
         .limit(limit)
         .skip(skip)
         .sort(sortText);
      const totalFeedbacks = await Feedback.countDocuments({ email: { $regex: search, $options: 'i' } });
      res.json({ page: parseInt(page), size: parseInt(size), total: totalFeedbacks, feedbacks });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_addCourse_post = async (req, res) => {
   try {
      const { name, description, riasec_area, strand } = req.body;
      const newCourse = new Course({ name, description, riasec_area, strand });
      const createdCourse = await newCourse.save();
      res.json({ course: createdCourse, message: 'Course created successfully!' });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_getCourses_get = async (req, res) => {
   try {
      const courses = await Course.find();
      res.json({ courses });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_getConversations_get = async (req, res) => {
   try {
      let { page, size, search, sort, order } = req.query;

      // set default page and size if queries are empty
      if (!page) page = 1;
      if (!size) size = 0;
      if (!search) search = '';
      if (!sort) sort = 'createdAt';
      if (!order) order = 'desc';

      const limit = parseInt(size);
      const skip = (parseInt(page) - 1) * size; // e.g. page = 2, size = 10 -> skip = 10
      let sortText = '';

      if (sort && order) sortText = order !== 'desc' ? sort : `-${sort}`; // with dash(-) means sort in descending

      const conversations = await Conversation.find({ name: { $regex: search, $options: 'i' } })
         .limit(limit)
         .skip(skip)
         .sort(sortText);
      const totalConversations = await Conversation.countDocuments({ name: { $regex: search, $options: 'i' } });
      res.json({ page: parseInt(page), size: parseInt(size), total: totalConversations, conversations });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_getConversation_get = async (req, res) => {
   try {
      const { conversationId } = req.params;
      const conversation = await Conversation.findById(conversationId);
      res.json({ conversation });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

module.exports = {
   admin_getFeedbacks_get,
   admin_getCourses_get,
   admin_addFeedback_post,
   admin_addCourse_post,
   admin_getConversations_get,
   admin_getConversation_get,
};
