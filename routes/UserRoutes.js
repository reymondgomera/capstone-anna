const router = require('express').Router();
const userController = require('../controller/UserController');

router.post('/conversation', userController.user_addConversation_post);
router.get('/courses-by-strand/:strand', userController.user_fetchCourseByStrand_get);

module.exports = router;
