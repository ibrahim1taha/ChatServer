const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
	message: {
		type: String,
		required: true
	},
	sender_id: {
		type: String,
		ref: 'Users',
		required: true
	},
	receiver_id: {
		type: String,
		ref: 'Users',
		required: true
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Chats', chatSchema);