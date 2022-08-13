const router = require('express').Router();
const authorization = require('../middleware/authorization');
const adminController = require('../controller/adminController');

router.get('/feedbacks', authorization, adminController.admin_getFeedbacks_get);
router.post('/feedback', adminController.admin_addFeedback_post);

module.exports = router;
