const router = require('express').Router();
const authorization = require('../middleware/authorization');
const adminController = require('../controller/adminController');

router.get('/feedbacks', authorization, adminController.admin_getFeedbacks_get);
router.post('/feedback', adminController.admin_addFeedback_post);
router.get('/courses', authorization, adminController.admin_getCourses_get);
router.post('/course', authorization, adminController.admin_addCourse_post);
router.get('/conversations', authorization, adminController.admin_getConversations_get);
router.get('/conversations/:conversationId', authorization, adminController.admin_getConversation_get);

module.exports = router;
