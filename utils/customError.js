module.exports = (statuscode, message) => {
	const err = new Error;
	err.statuscode = statuscode;
	err.message = message;
	throw err;
}