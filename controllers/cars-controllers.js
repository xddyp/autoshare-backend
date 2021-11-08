const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
// const getCoordsForAddress = require('../util/location');
const User = require('../models/user');
const Car = require('../models/car');
const Listing = require('../models/listing');
const Location = require('../models/location');

// router.get('/', carsControllers.getCarsByUserId);
const getCarsByUserId = async (req, res, next) => {
	const userId = req.userData.userId;
	let userWithCars;
	try {
		userWithCars = await User.findById(userId).populate({
			path: 'cars',
			populate: [
				{
					path: 'current',
					model: 'Listing',
				},
			],
		});
	} catch (err) {
		const error = new HttpError(
			'Fetching cars failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!userWithCars) {
		return next(new HttpError('Could not find the user.', 404));
	}
	res.json({
		cars: userWithCars.cars.map((car) => car.toObject({ getters: true })),
	});
};

// router.post(	'/token',carsControllers.getCarInfo);
const getCarInfo = async (req, res, next) => {
	const userId = req.userData.userId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			'Connecting car failed, please try again.',
			500
		);
		return next(error);
	}
	if (!user) {
		const error = new HttpError('Could not find user for provided id.', 404);
		return next(error);
	}

	const models = [
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/models%2F0x0-ModelS_22.jpg?alt=media&token=15d62157-7078-41ec-b1b7-b57aba3c0d45',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/models%2F0x0-ModelS_05.jpg?alt=media&token=91e6d17e-4947-4915-8ed1-fb7caa9f9398',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/models%2F0x0-ModelS_01.jpg?alt=media&token=314292c0-34d6-4419-b403-e1c0f8f9ec74',
	];
	const model3 = [
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/model3%2F0x0-Model3_07.jpg?alt=media&token=17341f93-b126-4203-bf0a-52f12f90615d',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/model3%2F0x0-Model3_06.jpg?alt=media&token=0dc2cc4e-0da5-41ba-acd9-6954427e8ced',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/model3%2F0x0-Model3_05.jpg?alt=media&token=623291e9-06bc-4a7f-a0d4-82f1e11776df',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/model3%2F0x0-Model3_02.jpg?alt=media&token=c712a2a1-ef87-4d05-98b3-b11d30e16785',
	];
	const modelx = [
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/modelx%2F0x0-ModelX_04.jpg?alt=media&token=1dfb1839-68c9-4ac9-8993-bdd1d6953124',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/modelx%2F0x0-ModelX_02.jpg?alt=media&token=d83caf68-5821-452e-a98a-e39b1509b417',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/modelx%2F0x0-ModelX_01.jpg?alt=media&token=90f6efc7-9a44-4787-8cb6-5291235d365c',
	];
	const modely = [
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/modely%2F0x0-ModelY_02.jpg?alt=media&token=1c80c038-3c44-4068-a039-cf934fc5ca33',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/modely%2F0x0-ModelY_01.jpg?alt=media&token=0fc4b6cb-0306-4373-a811-92ab3206f849',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/modely%2F0x0-ModelY-07.jpg?alt=media&token=d28b5df6-f6d2-4651-be60-1caafb8fef8d',
		'https://firebasestorage.googleapis.com/v0/b/autoshare-demo.appspot.com/o/modely%2F0x0-ModelY-04.jpg?alt=media&token=b9e4ff1c-0634-48c1-a5f0-11be4f6501e1',
	];
	const cars = [
		{
			model: 'Model S',
			year: 2012,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2013,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2014,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2015,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2016,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2017,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2018,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2019,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2020,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model S',
			year: 2021,
			url: models[Math.floor(Math.random() * models.length)],
		},
		{
			model: 'Model X',
			year: 2015,
			url: modelx[Math.floor(Math.random() * modelx.length)],
		},
		{
			model: 'Model X',
			year: 2016,
			url: modelx[Math.floor(Math.random() * modelx.length)],
		},
		{
			model: 'Model X',
			year: 2017,
			url: modelx[Math.floor(Math.random() * modelx.length)],
		},
		{
			model: 'Model X',
			year: 2018,
			url: modelx[Math.floor(Math.random() * modelx.length)],
		},
		{
			model: 'Model X',
			year: 2019,
			url: modelx[Math.floor(Math.random() * modelx.length)],
		},
		{
			model: 'Model X',
			year: 2020,
			url: modelx[Math.floor(Math.random() * modelx.length)],
		},
		{
			model: 'Model X',
			year: 2021,
			url: modelx[Math.floor(Math.random() * modelx.length)],
		},
		{
			model: 'Model 3',
			year: 2017,
			url: model3[Math.floor(Math.random() * model3.length)],
		},
		{
			model: 'Model 3',
			year: 2018,
			url: model3[Math.floor(Math.random() * model3.length)],
		},
		{
			model: 'Model 3',
			year: 2019,
			url: model3[Math.floor(Math.random() * model3.length)],
		},
		{
			model: 'Model 3',
			year: 2020,
			url: model3[Math.floor(Math.random() * model3.length)],
		},
		{
			model: 'Model 3',
			year: 2021,
			url: model3[Math.floor(Math.random() * model3.length)],
		},
		{
			model: 'Model Y',
			year: 2020,
			url: modely[Math.floor(Math.random() * modely.length)],
		},
		{
			model: 'Model Y',
			year: 2021,
			url: modely[Math.floor(Math.random() * modely.length)],
		},
	];
	let car = cars[Math.floor(Math.random() * cars.length)];
	res.status(201).json({ car: car });
};
// router.post(	'/',carsControllers.postCar);
const postCar = async (req, res, next) => {
	const userId = req.userData.userId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	const { car } = req.body;
	const createdCar = new Car({ ...car, host: userId });
	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			'Creating place failed, please try again.',
			500
		);
		return next(error);
	}
	if (!user) {
		const error = new HttpError('Could not find user for provided id.', 404);
		return next(error);
	}
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdCar.save({ session: sess });
		user.cars.push(createdCar);
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		// console.log(err);
		const error = new HttpError('Add car failed, please try again.', 500);
		return next(error);
	}
	res.status(201).json({ car: createdCar });
};

const getCarStatus = async (req, res, next) => {
	const carId = req.params.cid;
	const userId = req.userData.userId;
	// check car
	let car;
	try {
		car = await Car.findById(carId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not get listing.',
			500
		);
		return next(error);
	}
	if (!car) {
		const error = new HttpError('Could not find car for provided id.', 404);
		return next(error);
	}
	if (car.host.toString() !== userId) {
		const error = new HttpError('You are not allowed to list this car.', 404);
		return next(error);
	}
	let battery;
	battery = Math.floor(Math.random() * 101);
	let location;
	var random = Math.floor(Math.random() * 57);
	try {
		location = await Location.findOne().skip(random);
	} catch (err) {
		// console.log(err);
		const error = new HttpError(
			'Something went wrong, could not get location.',
			500
		);
		return next(error);
	}
	res.status(201).json({ location: location, battery: battery });
};
const postListing = async (req, res, next) => {
	const userId = req.userData.userId;
	const carId = req.params.cid;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	const { end, price, pid } = req.body;
	let startDate = new Date();
	startDate.setHours(0, 0, 0, 0);
	let endDate = new Date(end);
	endDate.setHours(0, 0, 0, 0);

	// check car and onwer
	let car;
	try {
		car = await Car.findById(carId);
	} catch (err) {
		const error = new HttpError(
			'Creating listing failed, please try again.',
			500
		);
		return next(error);
	}
	if (!car) {
		const error = new HttpError('Could not find car for provided id.', 404);
		return next(error);
	}
	if (car.host.toString() !== userId) {
		const error = new HttpError('You are not allowed to list this car.', 404);
		return next(error);
	}
	if (car.current) {
		const error = new HttpError('This car has been rented.', 404);
		return next(error);
	}
	// check location
	let location;
	try {
		location = await Location.findById(pid);
	} catch (err) {
		// console.log(err);
		const error = new HttpError(
			'Creating listing failed, please try again.',
			500
		);
		return next(error);
	}
	if (!location) {
		const error = new HttpError(
			'Could not find location for provided id.',
			404
		);
		return next(error);
	}
	const createdListing = new Listing({
		car: carId,
		location: {
			type: 'Point',
			coordinates: location.location.coordinates,
		},
		address: {
			street: location.address.street,
			city: location.address.city,
			state: location.address.state,
			zip: location.address.zip,
			country: location.address.country,
		},
		start: startDate,
		end: endDate,
		price,
	});
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdListing.save({ session: sess });
		car.current = createdListing._id;
		await car.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		// console.log(err);
		const error = new HttpError(
			'Creating listing failed, please try again.',
			500
		);
		return next(error);
	}
	await Car.populate(car, { path: 'current' });
	await res.status(201).json({ car: car });
};
const editListing = async (req, res, next) => {
	const userId = req.userData.userId;
	const carId = req.params.cid;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}
	const { end, price } = req.body;
	let startDate = new Date();
	startDate.setHours(0, 0, 0, 0);
	let endDate = new Date(end);
	endDate.setHours(0, 0, 0, 0);
	// check car
	let car;
	try {
		car = await Car.findById(carId).populate({
			path: 'current',
			model: Listing,
		});
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not update listing.',
			500
		);
		return next(error);
	}
	if (!car) {
		const error = new HttpError('Could not find car for provided id.', 404);
		return next(error);
	}
	if (car.host.toString() !== userId) {
		const error = new HttpError('You are not allowed to list this car.', 404);
		return next(error);
	}
	if (!car.current) {
		const error = new HttpError('This car is not listed.', 404);
		return next(error);
	}
	if (car.current.rented) {
		const error = new HttpError('This listing has been rented.', 404);
		return next(error);
	}
	if (car.current.returned) {
		const error = new HttpError('This listing has been closed.', 404);
		return next(error);
	}
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		car.current.start = startDate;
		car.current.end = endDate;
		car.current.price = price;
		await car.current.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Updating listing failed, please try again.',
			500
		);
		return next(error);
	}
	await Car.populate(car, { path: 'current ' });
	res.status(201).json({ car: car });
};
const deleteListing = async (req, res, next) => {
	const userId = req.userData.userId;
	const carId = req.params.cid;
	// check car
	let car;
	try {
		car = await Car.findById(carId).populate([
			{
				path: 'current',
				model: 'Listing',
			},
		]);
	} catch (err) {
		// console.log(err);
		const error = new HttpError(
			'Something went wrong, could not delete listing.',
			500
		);
		return next(error);
	}
	if (!car) {
		const error = new HttpError('Could not find car for provided id.', 404);
		return next(error);
	}
	if (car.host.toString() !== userId) {
		const error = new HttpError('You are not allowed to delete this car.', 404);
		return next(error);
	}
	if (!car.current) {
		const error = new HttpError('This car is not listed.', 404);
		return next(error);
	}
	if (car.current.rented) {
		const error = new HttpError('This listing has been rented.', 404);
		return next(error);
	}
	if (car.current.returned) {
		const error = new HttpError('This listing has been closed.', 404);
		return next(error);
	}
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await car.current.remove({ session: sess });
		car.current = undefined;
		await car.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		// console.log(err);
		const error = new HttpError(
			'Updating listing failed, please try again.',
			500
		);
		return next(error);
	}
	await Car.populate(car, { path: 'current' });
	res.status(201).json({ car: car });
};

// exports.getCar = getCar;
exports.getCarStatus = getCarStatus;
exports.postListing = postListing;
exports.editListing = editListing;
exports.deleteListing = deleteListing;
exports.getCarsByUserId = getCarsByUserId;
exports.postCar = postCar;
exports.getCarInfo = getCarInfo;
