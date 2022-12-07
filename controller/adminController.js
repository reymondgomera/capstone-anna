const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const Conversation = require('../models/Conversation');
const VideoMaterial = require('../models/VideoMaterial');
const Strand = require('../models/Strand');

const dialogflow = require('dialogflow');
const config = require('../config/key');
const projectId = config.google_project_id;
const credentials = {
   client_email: config.admin_google_client_email,
   private_key: config.admin_google_private_key,
};

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

const admin_getDistinctStrand_get = async (req, res) => {
   try {
      const distinctStrand = await Course.distinct('strand');
      res.json(distinctStrand);
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
         const UpdatedCourse = await Course.findByIdAndUpdate(courseId, { name, description, riasec_area, strand }, { returnDocument: 'after' });
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

      // Get the to be delete doc
      // Get the distict riasec_area
      // Get how many document/s have/contain the riasec_area/s same with the to be delete doc
      // for riasec_area basis - only delete doc if distict riasec_area's length is greater than or equal to 6 (>=) and the documents contain the riasec_area/s of to be delete doc is greater than 1 ( > 1) else not allowed to delete
      const toDeleteCourse = await Course.findById(courseId);
      const distinctRiasecAreas = await Course.distinct('riasec_area');
      let isDeleteAllowed = true;

      for (let i = 0; i < toDeleteCourse.riasec_area.length; i++) {
         const docsContainsRiasecAreas = await Course.find({ riasec_area: { $in: [toDeleteCourse.riasec_area[i]] } });
         if (docsContainsRiasecAreas.length === 1) {
            isDeleteAllowed = false;
            break;
         }
      }

      // 6 = six riasec areas original
      if (!(distinctRiasecAreas.length >= 6 && isDeleteAllowed)) {
         return res.status(405).json({
            message:
               "Delete operation can't be completed, courses must have atleast one course that contains one of the distinct RIASEC Areas and has a associate strand",
         });
      }

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
      let { page, size, search, sort, order, strand, year } = req.query;

      // set default page and size if queries are empty
      if (!page) page = 1;
      if (!size) size = 0;
      if (!search) search = '';
      if (!sort) sort = 'createdAt';
      if (!order) order = 'desc';

      // if (strand === 'all') strand = {};
      // else strand = { strand };

      const limit = parseInt(size);
      const skip = (parseInt(page) - 1) * size; // e.g. page = 2, size = 10 -> skip = 10
      // let sortText = '';
      // if (sort && order) sortText = order !== 'desc' ? sort : `-${sort}`; // with dash(-) means sort in descending

      // const conversations = await Conversation.find({ name: { $regex: search, $options: 'i' } })
      //    .find(strand)
      //    .limit(limit)
      //    .skip(skip)
      //    .sort(sortText);

      const sortObj = {};
      const filterDateObj = {};
      const filterstrandObj = {};

      order !== 'desc' ? (sortObj[sort] = 1) : (sortObj[sort] = -1); // 1 -asceding, -1 descending, Example sortObj value: {createdAt: 1} value to sort createdAt to asc
      if (strand && strand !== 'all') filterstrandObj.strand = strand;
      if (year) {
         // filterDateObj['createdAtBreakdown.year'] = { $in: [parseInt(year), parseInt(year) + 1] };
         filterDateObj['createdAt'] = { $gte: new Date(`${parseInt(year)}-06-01`), $lt: new Date(`${parseInt(year) + 1}-05-01`) }; // get data between June and april
      }

      const conversationsAggregation = [
         {
            $project: {
               name: 1,
               age: 1,
               sex: 1,
               strand: 1,
               riasec_code: 1,
               riasec_course_recommendation: 1,
               strand_course_recommendation: 1,
               createdAt: 1,
               createdAtBreakdown: { month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' }, year: { $year: '$createdAt' } },
            },
         },
         { $match: { name: { $regex: search, $options: 'i' } } },
         { $sort: sortObj },
         { $match: filterstrandObj },
         { $match: filterDateObj },
         { $skip: skip },
         { $limit: limit },
      ];
      const totalConversationsAggregation = [
         {
            $project: {
               name: 1,
               age: 1,
               sex: 1,
               strand: 1,
               riasec_code: 1,
               riasec_course_recommendation: 1,
               strand_course_recommendation: 1,
               createdAt: 1,
               createdAtBreakdown: { month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' }, year: { $year: '$createdAt' } },
            },
         },
         { $match: { name: { $regex: search, $options: 'i' } } },
         { $sort: sortObj },
         { $match: filterstrandObj },
         { $match: filterDateObj },
         { $count: 'total' },
      ];
      if (!limit) conversationsAggregation.pop(); // if no limit specified removes the limit pipeline

      // query using aggregation
      const conversations = await Conversation.aggregate(conversationsAggregation);
      const totalConversations = await Conversation.aggregate(totalConversationsAggregation);
      res.json({ page: parseInt(page), size: parseInt(size), total: totalConversations.length > 0 ? totalConversations[0].total : 0, conversations });

      // const totalConversations = await Conversation.countDocuments({ name: { $regex: search, $options: 'i' } });
      // res.json({ page: parseInt(page), size: parseInt(size), total: totalConversations, conversations });
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
         const UpdatedVideoMaterial = await VideoMaterial.findByIdAndUpdate(videoMaterialId, { title, url }, { returnDocument: 'after' });
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

const admin_getStrands_get = async (req, res) => {
   try {
      const strands = await Strand.find().sort({ name: 1 });
      res.json(strands);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_addStrands_post = async (req, res) => {
   try {
      const { name } = req.body; // name should not contain numbers, special character except ampersand(&) and dash(-)

      // I created a case sensitive index for property name, to strand name in caseinsensitive manner
      // case insensitive index -> fields -> {"name": 1} , collation -> { locale: "en_US", strength: 2 }
      // 1 - ascending order 2 - descinding
      const checkStrand = await Strand.find({ name }).collation({ locale: 'en_US', strength: 2 });
      if (checkStrand.length > 0) res.status(409).json({ message: 'Strand already exist!' });
      else {
         // saved strand to mongoDB
         const newStrand = new Strand({ name });
         const createdStrand = await newStrand.save();

         // add strand entities to dialogflow console
         // to manage conversational agent: I created new service account for dialogflow API admin, generated API KEY and as credentials
         const entityTypeClient = new dialogflow.EntityTypesClient({ projectId, credentials });
         const [entityTypes] = await entityTypeClient.listEntityTypes({ parent: `projects/${projectId}/agent` });
         const entityType = entityTypes.filter(en => en.displayName === 'strand')[0];

         const request = {
            parent: entityType.name,
            entities: [{ synonyms: [name.toUpperCase(), name.toLowerCase()], value: name.toUpperCase() }],
         };

         await entityTypeClient.batchCreateEntities(request);
         res.json({ strand: createdStrand, message: 'Strand created successfully!' });
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_updateStrand_put = async (req, res) => {
   try {
      const { strandId, name } = req.body; // name should not contain numbers, special character except ampersand(&) and dash(-)

      // I created a case sensitive index for property name, to strand name in caseinsensitive manner
      // case insensitive index -> fields -> {"name": 1} , collation -> { locale: "en_US", strength: 2 }
      // 1 - ascending order 2 - descinding
      const checkStrand = await Strand.find({ name }).collation({ locale: 'en_US', strength: 2 });
      if (checkStrand.length > 0) res.status(409).json({ message: 'Strand already exist!' });
      else {
         // update strand from mongodb
         const strandBeforeUpdate = await Strand.findByIdAndUpdate(strandId, { name }, { returnDocument: 'before' });

         // update strand entity to dialogflow console
         // to manage conversational agent: I created new service account for dialogflow API admin, generated API KEY and as credentials
         const entityTypeClient = new dialogflow.EntityTypesClient({ projectId, credentials });
         const [entityTypes] = await entityTypeClient.listEntityTypes({ parent: `projects/${projectId}/agent` });
         const entityType = entityTypes.filter(en => en.displayName === 'strand')[0];

         // delete the entity to update from dialoflow console then add a new one as an updated version of it
         const deleteRequest = {
            parent: entityType.name,
            entityValues: [strandBeforeUpdate.name.toUpperCase()],
         };
         const updateRequest = {
            parent: entityType.name,
            entities: [{ synonyms: [name.toUpperCase(), name.toLowerCase()], value: name.toUpperCase() }],
         };

         // update strand of the courses containing the strand to be updated
         await Course.updateMany({ strand: strandBeforeUpdate.name.toUpperCase() }, { $set: { 'strand.$': name.toUpperCase() } });

         // update dialogflow entity
         await entityTypeClient.batchDeleteEntities(deleteRequest);
         await entityTypeClient.batchCreateEntities(updateRequest);
         res.json({ message: 'Strand updated successfully!' });
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

const admin_deleteStrand_delete = async (req, res) => {
   try {
      const { strandId } = req.params;
      // delete strand from mongodb
      const deletedStrand = await Strand.findByIdAndDelete(strandId);

      // delete strand entity from dialogflow console
      // to manage conversational agent: I created new service account for dialogflow API admin, generated API KEY and as credentials
      const entityTypeClient = new dialogflow.EntityTypesClient({ projectId, credentials });
      const [entityTypes] = await entityTypeClient.listEntityTypes({ parent: `projects/${projectId}/agent` });
      const entityType = entityTypes.filter(en => en.displayName === 'strand')[0];

      const request = {
         parent: entityType.name,
         entityValues: [deletedStrand.name.toUpperCase()],
      };

      await entityTypeClient.batchDeleteEntities(request);
      res.json({ strand: deletedStrand, message: 'Strand deleted successfully!' });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
   }
};

module.exports = {
   admin_getFeedbacks_get,
   admin_addFeedbacks_post,
   admin_getCourses_get,
   admin_getDistinctStrand_get,
   admin_addCourses_post,
   admin_updateCourses_put,
   admin_deleteCourses_delete,
   admin_getConversations_get,
   admin_getConversationsById_get,
   admin_getVideoMaterials_get,
   admin_addVideoMaterials_post,
   admin_updateVideoMaterials_put,
   admin_deleteVideoMaterials_delete,
   admin_getStrands_get,
   admin_addStrands_post,
   admin_updateStrand_put,
   admin_deleteStrand_delete,
};
