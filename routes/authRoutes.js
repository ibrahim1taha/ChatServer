const express = require('express');
const router = express.Router();
const userModel = require('../model/user');
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.post('/signup', [
	body('email').isEmail().normalizeEmail().custom(async (val, { req }) => {
		try {
			const user = await userModel.findOne({ email: val });
			if (user) {
				throw new Error('Email already exists!');
			}
		} catch (error) {
			throw error
		}
	}),
	body('password', 'password should be more than 7 letters').isLength({ min: 5 }),
	body('confirmPassword', 'password not Equal conformation').custom((val, { req }) => {
		return val === req.body.password;
	})
], authController.postSignup);


router.post('/login', authController.postLogin)

module.exports = router; 