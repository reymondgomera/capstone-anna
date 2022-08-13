const Feedback = require('../models/Feedback');

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
      const feedbacks = await Feedback.find().lean();
      res.json(feedbacks);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

module.exports = {
   admin_addFeedback_post,
   admin_getFeedbacks_get,
};
