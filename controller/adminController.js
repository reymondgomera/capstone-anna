const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const Conversation = require('../models/Conversation');
const VideoMaterial = require('../models/VideoMaterial');

// Feedback Controllers
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

const admin_addFeedbacks_post = async (req, res) => {
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

// Course Controllers
const admin_getCourses_get = async (req, res) => {
   try {
      let { page, size, search, sort, order } = req.query;

      // set default page and size if queries are empty
      if (!page) page = 1;
      if (!size) size = 0;
      if (!search) search = '';
      if (!sort) sort = 'name';
      if (!order) order = 'asc';

      const limit = parseInt(size);
      const skip = (parseInt(page) - 1) * size; // e.g. page = 2, size = 10 -> skip = 10
      let sortText = '';

      if (sort && order) sortText = order !== 'desc' ? sort : `-${sort}`; // with dash(-) means sort in descending

      const courses = await Course.find({ name: { $regex: search, $options: 'i' } })
         .limit(limit)
         .skip(skip)
         .sort(sortText);
      const totalCourses = await Course.countDocuments({ name: { $regex: search, $options: 'i' } });
      res.json({ page: parseInt(page), size: parseInt(size), total: totalCourses, courses });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_addCourses_post = async (req, res) => {
   try {
      const { name, description, riasec_area, strand } = req.body;

      // I created a case sensitive index for property name, to query course name in caseinsensitive manner
      // case sensitive index -> fields -> {"name": 1} , collation -> { locale: "en_US", strength: 2 }
      // 1 - ascending order 2 - descinding
      const checkCourse = await Course.find({ name }).collation({ locale: 'en_US', strength: 2 });
      if (checkCourse.length > 0) res.status(409).json({ message: 'Course already exist!' });
      else {
         const newCourse = new Course({ name, description, riasec_area, strand });
         const createdCourse = await newCourse.save();
         res.json({ course: createdCourse, message: 'Course created successfully!' });
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_updateCourses_put = async (req, res) => {
   try {
      const { courseId, name, description, riasec_area, strand } = req.body;

      // I created a case sensitive index for property name, to query course name in caseinsensitive manner
      // case sensitive index -> fields -> {"name": 1} , collation -> { locale: "en_US", strength: 2 }
      // 1 - ascending order 2 - descinding
      const checkCourse = await Course.find({ name }).collation({ locale: 'en_US', strength: 2 });
      if (checkCourse.length > 0) res.status(409).json({ message: 'Course already exist!' });
      else {
         const UpdatedCourse = await Course.findByIdAndUpdate(courseId, { name, description, riasec_area, strand });
         res.json({ course: UpdatedCourse, message: 'Course updated successfully!' });
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_deleteCourses_delete = async (req, res) => {
   try {
      const { courseId } = req.params;
      const deletedCourse = await Course.findByIdAndDelete(courseId);
      res.json({ course: deletedCourse, message: 'Course deleted successfully!' });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

// Conversation Controllers
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

const admin_getConversationsById_get = async (req, res) => {
   try {
      const { conversationId } = req.params;
      const conversation = await Conversation.findById(conversationId);
      res.json({ conversation });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_getVideoMaterials_get = async (req, res) => {
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

      const videoMaterials = await VideoMaterial.find({ title: { $regex: search, $options: 'i' } })
         .limit(limit)
         .skip(skip)
         .sort(sortText);
      const totalVideoMaterials = await VideoMaterial.countDocuments({ title: { $regex: search, $options: 'i' } });
      res.json({ page: parseInt(page), size: parseInt(size), total: totalVideoMaterials, videoMaterials });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_addVideoMaterials_post = async (req, res) => {
   try {
      const { title, url } = req.body;

      // I created a case sensitive index for property title, to video material title in caseinsensitive manner
      // case sensitive index -> fields -> {"title": 1} , collation -> { locale: "en_US", strength: 2 }
      // 1 - ascending order 2 - descinding
      const checkVideoMaterial = await VideoMaterial.find({ title }).collation({ locale: 'en_US', strength: 2 });
      if (checkVideoMaterial.length > 0) res.status(409).json({ message: 'Video Material already exist!' });
      else {
         const newVideoMaterial = new VideoMaterial({ title, url });
         const createdVideoMaterial = await newVideoMaterial.save();
         res.json({ videoMaterial: createdVideoMaterial, message: 'Video Material created successfully!' });
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_updateVideoMaterials_put = async (req, res) => {
   try {
      const { videoMaterialId, title, url } = req.body;

      // I created a case sensitive index for property title, to video material title in caseinsensitive manner
      // case sensitive index -> fields -> {"title": 1} , collation -> { locale: "en_US", strength: 2 }
      // 1 - ascending order 2 - descinding
      const checkVideoMaterial = await VideoMaterial.find({ title }).collation({ locale: 'en_US', strength: 2 });
      if (checkVideoMaterial.length > 0) res.status(409).json({ message: 'Video Material already exist!' });
      else {
         const UpdatedVideoMaterial = await VideoMaterial.findByIdAndUpdate(videoMaterialId, { title, url });
         res.json({ videoMaterial: UpdatedVideoMaterial, message: 'Video Material updated successfully!' });
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_deleteVideoMaterials_delete = async (req, res) => {
   try {
      const { videoMaterialId } = req.params;
      const deletedVideoMaterial = await VideoMaterial.findByIdAndDelete(videoMaterialId);
      res.json({ videoMaterial: deletedVideoMaterial, message: 'Video Material deleted successfully!' });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

module.exports = {
   admin_getFeedbacks_get,
   admin_addFeedbacks_post,
   admin_getCourses_get,
   admin_addCourses_post,
   admin_updateCourses_put,
   admin_deleteCourses_delete,
   admin_getConversations_get,
   admin_getConversationsById_get,
   admin_getVideoMaterials_get,
   admin_addVideoMaterials_post,
   admin_updateVideoMaterials_put,
   admin_deleteVideoMaterials_delete,
};
