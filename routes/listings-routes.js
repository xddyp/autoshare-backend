const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const listingsController = require('../controllers/listings-controllers');

const router = express.Router();

router.get(
	'/:address/:dropoff',
	[check('address').not().isEmpty(), check('dropoff').not().isEmpty()],
	listingsController.getSearchListings
);

router.use(checkAuth);

router.get('/reservation', listingsController.getListing);

router.post(
	'/:lid',
	[check('reservation').not().isEmpty()],
	listingsController.reserveListing
);
router.patch('/:lid', listingsController.returnReservation);

// router.delete('/:lid', listingsController.cancelReservation);

module.exports = router;
