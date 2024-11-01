const express = require('express');
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
const connectDB = require('./config/Database');
const cors = require('cors')

// routes 
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

connectDB();

app.use(cors())

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Error middlewaer 
app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	res.status(status).json({
		status: status,
		message: error.message
	})
})

app.listen(8080, () => {
	console.log('Server run successfully!');
});

