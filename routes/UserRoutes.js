const router = require('express').Router();
const userController = require('../controller/UserController');

router.post('/conversations', userController.user_addConversations_post);
router.get('/courses-by-strand/:strand', userController.user_getCoursesByStrand_get);

module.exports = router;
