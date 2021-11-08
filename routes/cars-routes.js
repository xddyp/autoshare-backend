const express = require('express');
const { check } = require('express-validator');

const carsController = require('../controllers/cars-controllers');
// const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

// get car information
router.post('/token', carsController.getCarInfo);

// get a car location
router.get('/:cid/status', carsController.getCarStatus);

// post a listing of a car
router.post(
	'/:cid',
	[
		check('pid').not().isEmpty(),
		check('end').not().isEmpty(),
		check('price').not().isEmpty(),
	],
	carsController.postListing
);
// edit a listing of a car
router.patch(
	'/:cid',
	[check('end').not().isEmpty(), check('price').not().isEmpty()],
	carsController.editListing
);
// delete a listing of a car
router.delete('/:cid', carsController.deleteListing);

// get cars by user id
router.get('/', carsController.getCarsByUserId);
// post a car
router.post('/', [check('car').not().isEmpty()], carsController.postCar);
module.exports = router;
