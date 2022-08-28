const router = require('express').Router();
const authorization = require('../middleware/authorization');
const adminController = require('../controller/adminController');

router.get('/feedbacks', authorization, adminController.admin_getFeedbacks_get);
router.post('/feedbacks', adminController.admin_addFeedbacks_post);
router.get('/courses', authorization, adminController.admin_getCourses_get);
router.post('/courses', authorization, adminController.admin_addCourses_post);
router.get('/conversations', authorization, adminController.admin_getConversations_get);
router.get('/conversations/:conversationId', authorization, adminController.admin_getConversationsById_get);

module.exports = router;
