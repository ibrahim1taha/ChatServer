const userModel = require('../model/user');
const chatModel = require('../model/chat');
const customError = require('../utils/customError');
const objectId = require('mongoose').Types.ObjectId;
const socket = require('../socket');

exports.getUrContact = async (req, res, next) => {
	try {
		const OurUserId = req.userId
		let newUsersWithLastMessage = await userModel.aggregate([
			{
				$match: { _id: { $ne: new objectId(OurUserId) } }
			},
			{
				$lookup: {
					from: "chats",
					let: { thisUserId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$or: [
										{
											$and: [
												{ $eq: ["$sender_id", OurUserId] }, { $eq: ["$receiver_id", { $toString: "$$thisUserId" }] } // Convert ObjectId to string
											]
										},
										{
											$and: [
												{ $eq: ["$receiver_id", OurUserId] }, { $eq: ["$sender_id", { $toString: "$$thisUserId" }] }
											]
										}
									]
								}
							}
						},
						{ $sort: { timestamp: -1 } },
						{ $limit: 1 }
					],
					as: "usersWithLastMsg"
				}
			},
			{
				$addFields: {
					defaultMsg: {
						$cond: {
							if: { $lt: [{ $size: "$usersWithLastMsg" }, 1] },
							then: "start conversation!",
							else: "$$REMOVE"
						}
					}
				}
			},
			{
				$project: {
					email: 0,
					password: 0,
					usersWithLastMsg: {
						_id: 0
					}
				}
			},
			{
				$sort: { "usersWithLastMsg.timestamp": -1 }
			}
		]);

		res.status(200).json({
			users: newUsersWithLastMessage,
			message: 'users fetched successfully!'
		})

	} catch (error) {
		next(error)
	}
}
// exports.getUrContact = async (req, res, next) => {
// 	try {
// 		const userId = req.userId;
// 		const users = await userModel.find({ _id: { $ne: userId } }, { email: 0, password: 0 })

// 		if (!users) customError(404, 'no users found');

// 		const thisUserChats = await chatModel.find({
// 			$or: [
// 				{ sender_id: userId },
// 				{ receiver_id: userId }
// 			]
// 		});
// 		console.log(thisUserChats);
// 		// adding to each user last message with the sender user .
// 		let newUsersWithLastMessage = [];
// 		let usersWithLastMessage = users.map(user => {
// 			for (const chat of thisUserChats) {
// 				const isUserSender = (chat.receiver_id.toString() === userId && chat.sender_id.toString() === user._id.toString());
// 				const isUserReceiver = (chat.sender_id.toString() === userId && chat.receiver_id.toString() === user._id.toString());
// 				if ((isUserSender || isUserReceiver) && chat.timestamp) {
// 					newUsersWithLastMessage.push({
// 						...user._doc,
// 						lastMsg: chat.message,
// 						lastMsgTime: chat.timestamp,
// 						isSender: isUserSender,
// 						isReceiver: isUserReceiver
// 					})
// 				}
// 			}
// 		})

// 		newUsersWithLastMessage.sort((a, b) =>
// 			new Date(b.lastMsgTime) - new Date(a.lastMsgTime)
// 		)
// 		// console.log(usersWithLastMessage);
// 		res.status(200).json({
// 			users: newUsersWithLastMessage,
// 			message: 'users fetched successfully!'
// 		})

// 	} catch (error) {
// 		next(error)
// 	}
// }

exports.sendMessage = async (req, res, next) => {
	try {
		const { msg, receiver_id } = req.body;

		if (!msg || !receiver_id) customError(422, 'empty message');

		const newMsg = new chatModel({
			message: msg,
			sender_id: req.userId.toString(),
			receiver_id: receiver_id.toString()
		});

		await newMsg.save();

		socket.getIO().emit('send', {
			action: 'sendMsg',
			message: newMsg
		})

		res.status(201).json({
			newMsg: newMsg,
			message: 'Sent Successfully!'
		});

	} catch (error) {
		next(error);
	}
}

exports.renderChat = async (req, res, next) => {
	try {
		const receiver_id = req.params.receiver_id;
		if (!receiver_id) customError(404, 'this chat not exits!');

		const chatMessages = await chatModel.find({
			$or: [
				{ sender_id: req.userId, receiver_id: receiver_id },
				{ sender_id: receiver_id, receiver_id: req.userId }
			]
		}).sort({ timestamp: -1 });

		res.status(200).json({
			message: `This is the messages between ${req.userId} and ${receiver_id}`,
			messages: chatMessages
		})

	} catch (error) {
		next(error);
	}
}


