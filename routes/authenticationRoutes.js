const router = require('express').Router();
const authorization = require('../middleware/authorization');
const userController = require('../controller/authenticationController');

router.post('/signup', userController.signup_post);
router.post('/signin', userController.signin_post);
router.get('/is-varify', authorization, userController.isVarify_get);

module.exports = router;
