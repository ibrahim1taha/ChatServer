const multer = require('multer');
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images')
	},
	filename: (req, file, cb) => {
		cb(null, uuidv4() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	(file.mimetype === 'image/png'
		|| file.mimetype === 'image/jpg'
		|| file.mimetype === 'image/jpeg') ? cb(null, true) : cb(null, false);
}

module.exports = multer({ storage: storage, fileFilter: fileFilter }); 