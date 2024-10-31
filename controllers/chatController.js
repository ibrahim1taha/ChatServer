const { nextTick } = require('process');
const userModel = require('../model/user');
const chatModel = require('../model/chat');
const customError = require('../utils/customError');
// const objectId = require('mongoose').Types.ObjectId;

exports.getUrContact = async (req, res, next) => {
	try {
		const userId = req.userId;

		const users = await userModel.find({ _id: { $ne: userId } })
		if (!users) customError(404, 'no users found');

		const thisUserChats = await chatModel.find({
			$or: [
				{ sender_id: userId },
				{ receiver_id: userId }
			]
		}).sort({ timestamp: -1 });

		// adding to each user last message with the sender user .
		const usersWithLastMessage = users.map(user => {
			for (const chat of thisUserChats) {
				const isUserSender = (chat.receiver_id === userId && chat.sender_id.user._id.toString());
				const isUserReceiver = (chat.sender_id === userId && chat.receiver_id === user._id.toString());
				if (isUserSender || isUserReceiver) {
					return {
						...user._doc,
						lastMsg: chat.message,
						lastMsgTime: chat.timestamp,
						isSender: isUserSender,
						isReceiver: isUserReceiver
					}
				}
			}
			return {
				...user._doc,
				lastMsg: "start conversation",
				isSender: false,
				isReceiver: false
			}
		})
		// console.log(usersWithLastMessage);

		res.status(200).json({
			users: usersWithLastMessage,
			message: 'users fetched successfully!'
		})

	} catch (error) {
		next(error)
	}
}

exports.sendMessage = async (req, res, next) => {
	try {
		const { msg, receiver_id } = req.body;

		if (!msg || !receiver_id) customError(422, 'empty message');

		const newMsg = new chatModel({ message: msg, sender_id: req.userId.toString(), receiver_id: receiver_id.toString() });
		await newMsg.save();
		res.status(201).json({ newMsg: newMsg, message: 'Sent Successfully!' });

	} catch (error) {
		next(error);
	}
}