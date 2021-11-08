const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const listingSchema = new Schema({
	car: { type: mongoose.Types.ObjectId, required: true, ref: 'Car' },
	location: {
		type: {
			type: String, // Don't do `{ location: { type: String } }`
			enum: ['Point'], // 'location.type' must be 'Point'
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	address: {
		street: { type: String, required: true },
		city: { type: String, required: true },
		state: { type: String, required: true },
		zip: { type: String, required: true },
		country: { type: String, required: true },
	},
	start: { type: Date, required: true },
	end: { type: Date, required: true },
	price: { type: Number, required: true },
	rented: { type: Boolean, default: false },
	returned: { type: Boolean, default: false },
	pickup: { type: Date },
	dropoff: { type: Date },
	cost: { type: Number },
	renter: { type: mongoose.Types.ObjectId, ref: 'User' },
});
listingSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Listing', listingSchema);
