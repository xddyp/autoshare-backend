const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Car = require('../models/car');
const Listing = require('../models/listing');
const Location = require('../models/location');
const getCoordsForAddress = require('../util/location');

const getSearchListings = async (req, res, next) => {
	const address = decodeURIComponent(req.params.address);
	const dropoff = decodeURIComponent(req.params.dropoff);

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}
	// calculate days
	let dropoffDay = new Date(dropoff);
	dropoffDay.setHours(0, 0, 0, 0);
	let pickup = new Date();
	pickup.setHours(0, 0, 0, 0);
	let days = Math.round(
		(dropoffDay.getTime() - pickup.getTime()) / (1000 * 3600 * 24)
	);
	// Travel speeds in most of Midtown Manhattan range between 6 and 9 mph
	// 22.5 mph=600m/min
	// 30min * 600m/min=18,000m
	// $0.50 for every 321.90 meters
	// 18,000m /300 * 0.5= $30
	let listings;
	try {
		listings = await Listing.aggregate()
			.near({
				near: {
					type: 'Point',
					coordinates: [coordinates.lng, coordinates.lat],
				},
				distanceField: 'dist.calculated',
				maxDistance: 18000,
				key: 'location',
				// query: { rented:false, },
			})
			.match({
				rented: false,
				end: { $gte: dropoffDay },
			});

		await Listing.populate(listings, {
			path: 'car',
			select: 'model year url',
		});
	} catch (err) {
		// console.log(err);
		const error = new HttpError(
			'Something went wrong, could not find listings.',
			500
		);
		return next(error);
	}
	res.status(201).json({
		listings: listings,
		reservation: { days: days, dropoff: dropoffDay },
	});
};

// router.get('/reservation', listingsController.getListing);
const getListing = async (req, res, next) => {
	const userId = req.userData.userId;
	let userWithListing;
	try {
		userWithListing = await User.findById(userId).populate({
			path: 'current',
		});
	} catch (err) {
		const error = new HttpError(
			'Fetching user failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!userWithListing) {
		return next(new HttpError('Could not find the user.', 404));
	}

	res.status(201).json({ listing: userWithListing.current });
};
const reserveListing = async (req, res, next) => {
	const userId = req.userData.userId;
	const listingId = req.params.lid;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	const { reservation } = req.body;
	// get user
	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			'Fetching user information failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!user) {
		return next(new HttpError('Could not find the user.', 404));
	}
	// check listing
	let listing;
	try {
		listing = await Listing.findById(listingId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not get listing.',
			500
		);
		return next(error);
	}
	if (!listing) {
		const error = new HttpError('Could not find listing for provided id.', 404);
		return next(error);
	}
	if (listing.returned || listing.end < Date.now()) {
		const error = new HttpError('This listing has been closed', 404);
		return next(error);
	}
	if (listing.rented) {
		const error = new HttpError('This listing has been reserved', 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		listing.pickup = new Date();
		listing.dropoff = reservation.dropoff;
		listing.rented = true;
		listing.renter = userId;
		listing.cost = reservation.days * listing.price;
		await listing.save({ session: sess });
		user.current = listing.id;
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Creating listing failed, please try again.',
			500
		);
		return next(error);
	}
	res.status(201).json({ listing: listing });
};
// const cancelReservation = async (req, res, next) => {
// 	const userId = req.userData.userId;
// 	const listingId = req.params.lid;
// 	// check listing
// 	let listing;
// 	try {
// 		listing = await Listing.findById(listingId).populate({
// 			path: 'car',
// 			model: Car,
// 		});
// 	} catch (err) {
// 		const error = new HttpError(
// 			'Something went wrong, could not get listing.',
// 			500
// 		);
// 		return next(error);
// 	}
// 	if (!listing) {
// 		const error = new HttpError('Could not find listing for provided id.', 404);
// 		return next(error);
// 	}
// 	if (listing.renter.toString() !== userId || !listing.rented) {
// 		const error = new HttpError('You did not reserve this listing', 404);
// 		return next(error);
// 	}
// 	if (listing.returned || listing.end < Date.now()) {
// 		const error = new HttpError('This listing has been closed', 404);
// 		return next(error);
// 	}
// 	if (listing.pickup < Date.now()) {
// 		const error = new HttpError(
// 			'Reservation cannot be canceled after pickup date',
// 			404
// 		);
// 		return next(error);
// 	}
// 	try {
// 		const sess = await mongoose.startSession();
// 		sess.startTransaction();
// 		listing.car.current = undefined;
// 		await listing.remove({ session: sess });
// 		await listing.car.save({ session: sess });
// 		await sess.commitTransaction();
// 	} catch (err) {
// 		const error = new HttpError(
// 			'Updating listing failed, please try again.',
// 			500
// 		);
// 		return next(error);
// 	}
// 	res.status(201).json({ car: listing.car });
// };
const returnReservation = async (req, res, next) => {
	const userId = req.userData.userId;
	const listingId = req.params.lid;
	// check listing
	let listing;
	try {
		listing = await Listing.findById(listingId)
			.populate({
				path: 'car',
				model: Car,
			})
			.populate({
				path: 'renter',
				model: User,
			});
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not get listing.',
			500
		);
		return next(error);
	}
	if (!listing) {
		const error = new HttpError('Could not find listing for provided id.', 404);
		return next(error);
	}
	if (listing.renter.id.toString() !== userId || !listing.rented) {
		const error = new HttpError('You did not reserve this listing', 404);
		return next(error);
	}
	if (listing.returned || listing.end < Date.now()) {
		const error = new HttpError('This listing has been closed', 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		listing.returned = true;
		await listing.save({ session: sess });
		listing.car.history.push(listingId);
		listing.car.current = undefined;
		await listing.car.save({ session: sess });
		listing.renter.current = undefined;
		listing.renter.history.push(listingId);
		await listing.renter.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Updating listing failed, please try again.',
			500
		);
		return next(error);
	}
	res.status(201).json({ listing: listing.renter.current });
};

exports.getSearchListings = getSearchListings;
exports.getListing = getListing;
exports.reserveListing = reserveListing;
// exports.cancelReservation = cancelReservation;
exports.returnReservation = returnReservation;
