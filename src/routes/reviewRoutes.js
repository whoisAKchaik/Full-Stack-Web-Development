const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewController');

router.get('/', controller.readAllReview);
router.post('/', controller.createReview);
router.get('/:id', controller.readReviewById);
router.put('/:id', controller.checkReviewOwnership, controller.updateReviewById);
router.delete('/:id', controller.checkReviewOwnership, controller.deleteReviewById);

// Export the router object:
module.exports = router;