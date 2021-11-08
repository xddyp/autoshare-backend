const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	model: { type: String, required: true },
	year: { type: String, required: true },
	host: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	current: { type: mongoose.Types.ObjectId, ref: 'Listing' },
	history: [{ type: mongoose.Types.ObjectId, ref: 'Listing' }],
});

module.exports = mongoose.model('Model', modelSchema);
