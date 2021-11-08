// const fs = require('fs');

// const { validationResult } = require('express-validator');
// const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
// const getCoordsForAddress = require('../util/location');
const User = require('../models/user');

// router.get('/listings', listingsController.getlistingsByUserId);
const getlistingsByUserId = async (req, res, next) => {
	const userId = req.userData.userId;
	let userWithlistings;
	try {
		userWithlistings = await User.findById(userId).populate('listings');
	} catch (err) {
		const error = new HttpError(
			'Fetching places failed, please try again later.',
			500
		);
		return next(error);
	}
	if (!userWithlistings) {
		return next(new HttpError('Could not find the user.', 404));
	}
	if (userWithlistings.listings.length === 0) {
		res.json({ listings: [] });
	} else {
		res.json({
			listings: userWithlistings.listings.map((rental) =>
				rental.toObject({ getters: true })
			),
		});
	}
};
// router.post('/listings/:cid', listingsController.postRental);
const postRental = async (req, res, next) => {
	const userId = req.userData.userId;
	const carId = req.params.cid;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	const { start, end } = req.body;
	// find the car
	let car;
	try {
		car = await Car.findById(carId);
	} catch (err) {
		const error = new HttpError('Renting failed, please try again.', 500);
		return next(error);
	}

	if (!user) {
		const error = new HttpError('Could not find car for provided id.', 404);
		return next(error);
	}
	// find the user
	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError('Renting failed, please try again.', 500);
		return next(error);
	}

	if (!user) {
		const error = new HttpError('Could not find user for provided id.', 404);
		return next(error);
	}
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		// save car information to the renter
		user.currentRental = { start, end, carId, price: car.price };
		await user.save({ session: sess });
		// save renter information to the car
		car.currentRental = { start, end, userId, price: car.price };
		await car.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Creating rental failed, please try again.',
			500
		);
		return next(error);
	}
	res.status(201).json({ listings: { start, end, carId, userId } });
};

// router.delete('/listings/:cid', listingsController.deleteRental);
const cancelRental = async (req, res, next) => {
	const carId = req.params.cid;
	const userId = req.userData.userId;
	let car;
	try {
		car = await Car.findById(carId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not cancel rental.',
			500
		);
		return next(error);
	}

	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError('Canceling failed, please try again.', 500);
		return next(error);
	}
	if (!user) {
		const error = new HttpError('Could not find user for this id.', 404);
		return next(error);
	}
	if (car.currentRental.userId !== userId) {
		const error = new HttpError(
			'You are not allowed to cancel this rental.',
			401
		);
		return next(error);
	}
	if (Date.now() > car.currentRental.pick) {
		const error = new HttpError(
			'You cannot cancel the car after pickup time.',
			401
		);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		car.currentRental = null;
		await car.save({ session: sess });
		user.currentRental = null;
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete car.',
			500
		);
		return next(error);
	}
	res.status(200).json({ message: 'Deleted car.' });
};

// router.delete('/listings/:cid', listingsController.returnRental);
const returnRental = async (req, res, next) => {
	const carId = req.params.cid;
	const userId = req.userData.userId;
	let car;
	try {
		car = await Car.findById(carId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not return rental.',
			500
		);
		return next(error);
	}
	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError('Returning failed, please try again.', 500);
		return next(error);
	}
	if (!user) {
		const error = new HttpError('Could not find user for this id.', 404);
		return next(error);
	}
	if (car.currentRental.userId !== userId) {
		const error = new HttpError(
			'You are not allowed to return this rental.',
			401
		);
		return next(error);
	}
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		car.listings.push(car.currentRental);
		car.currentRental = null;
		await car.save({ session: sess });
		user.listings.push(user.currentRental);
		user.currentRental = null;
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete car.',
			500
		);
		return next(error);
	}
	res.status(200).json({ message: 'Deleted car.' });
};

exports.getlistingsByUserId = getlistingsByUserId;
exports.postRental = postRental;
exports.cancelRental = cancelRental;
exports.returnRental = returnRental;
