const jwt = require('jsonwebtoken');
const customError = require('../utils/customError');


module.exports = (req, res, next) => {
	const authFromHeader = req.get('Authorization');
	if (!authFromHeader) customError(401, 'Unauthorized');

	const token = authFromHeader.split(' ')[1] // ['Bearer' , 'token' ]

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
	next();
}