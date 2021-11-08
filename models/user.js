const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 6 },
	cars: [{ type: mongoose.Types.ObjectId, ref: 'Car' }],
	history: [{ type: mongoose.Types.ObjectId, ref: 'Listing' }],
	current: { type: mongoose.Types.ObjectId, ref: 'Listing' },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
