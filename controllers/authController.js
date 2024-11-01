const userModel = require('../model/user');
const path = require('path');
const { validationResult } = require('express-validator');
const customError = require('../utils/customError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignup = async (req, res, next) => {
	try {
		const validationErr = validationResult(req);
		if (!validationErr.isEmpty()) {
			console.log(validationErr.array());
			customError(400, validationErr.array()[0].msg);
		}

		const { name, email, password } = req.body;
		const hashedPass = await bcrypt.hash(password, 12);


		imageUrl = req.file ? req.file.path.replace("\\", "/") : 'default'

		const newUser = new userModel({ name: name, imageUrl: imageUrl, email: email, password: hashedPass });
		await newUser.save();

		const isMatch = await bcrypt.compare(password, newUser.password);

		if (!isMatch) customError(422, 'Email or password incorrect!');

		const token = jwt.sign({ email: newUser.email, userId: newUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: '120h' })

		res.status(201).json({
			user: newUser,
			token: token,
			message: 'Signup Successfully!'
		});
	} catch (error) {
		// console.log(error);
		next(error);
	}
}

exports.postLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await userModel.findOne({ email: email });

		if (!user) customError(404, 'user does not exits ');

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) customError(422, 'Email or password incorrect!');

		const token = jwt.sign({ email: user.email, userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '120h' })

		res.status(200).json({
			token: token,
			userId: user._id.toString()
		})
	} catch (error) {
		next(error);
	}
}