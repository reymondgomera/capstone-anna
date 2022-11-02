const router = require('express').Router();
const authorization = require('../middleware/authorization');
const adminController = require('../controller/adminController');

router.get('/feedbacks', authorization, adminController.admin_getFeedbacks_get);
router.post('/feedbacks', adminController.admin_addFeedbacks_post);

router.get('/courses', authorization, adminController.admin_getCourses_get);
router.post('/courses', authorization, adminController.admin_addCourses_post);
router.put('/courses', authorization, adminController.admin_updateCourses_put);
router.delete('/courses/:courseId', authorization, adminController.admin_deleteCourses_delete);
router.get('/courses-distinct-strand', authorization, adminController.admin_getDistinctStrand_get);

router.get('/conversations', authorization, adminController.admin_getConversations_get);
router.get('/conversations/:conversationId', authorization, adminController.admin_getConversationsById_get);

router.get('/video-materials', authorization, adminController.admin_getVideoMaterials_get);
router.post('/video-materials', authorization, adminController.admin_addVideoMaterials_post);
router.put('/video-materials', authorization, adminController.admin_updateVideoMaterials_put);
router.delete('/video-materials/:videoMaterialId', authorization, adminController.admin_deleteVideoMaterials_delete);

router.get('/strands', authorization, adminController.admin_getStrands_get);
router.post('/strands', authorization, adminController.admin_addStrands_post);
router.put('/strands', authorization, adminController.admin_updateStrand_put);
router.delete('/strands/:strandId', authorization, adminController.admin_deleteStrand_delete);

module.exports = router;
