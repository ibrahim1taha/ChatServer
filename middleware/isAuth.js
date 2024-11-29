const jwt = require('jsonwebtoken');
const customError = require('../utils/customError');
const userModel = require('../model/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
module.exports = async (req, res, next) => {
	const authFromHeader = req.get('Authorization');
	if (!authFromHeader) customError(401, 'Unauthorized');

	const token = authFromHeader.split(' ')[1]

	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET)
	} catch (error) {
		error.statuscode = 500;
		error.message = 'decoded fail';
		next(error);
	}
	if (!decodedToken)
		customError(401, 'not auth');

	req.userId = decodedToken.userId;
	const isUser = await userModel.find(new ObjectId(req.userId));
	console.log(isUser);
	if (!isUser.length) {
		res.json({
			message: "this user does not exits!"
		})
		customError(404, "this user does not exits!");
	}
	next();
}