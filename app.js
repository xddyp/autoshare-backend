const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const carsRoutes = require('./routes/cars-routes');
const usersRoutes = require('./routes/users-routes');
const listingsRoutes = require('./routes/listings-routes');
const HttpError = require('./models/http-error');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	next();
});

app.use('/api/users', usersRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/listings', listingsRoutes);

app.use((req, res, next) => {
	const error = new HttpError('Could not find this page.', 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
	.connect(process.env.mongoURI)
	.then(() => {
		console.log('MongoDB Connected...');
		app.listen(process.env.PORT || 5000);
	})
	.catch((err) => {
		// console.log(err);
	});
