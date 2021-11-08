const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
	name: { type: String, required: true },
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
});
locationSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Location', locationSchema);
