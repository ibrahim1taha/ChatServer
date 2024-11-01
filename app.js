const path = require('path');
const { createServer } = require('http');
const express = require('express');
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
const connectDB = require('./config/Database');
const cors = require('cors')
const { Server } = require('socket.io');
const socket = require('./socket');
const httpServer = createServer(app);


// routes 
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

connectDB();

app.use(cors())

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Error handler 
app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	res.status(status).json({
		status: status,
		message: error.message
	})
})

// socket server 
const io = socket.initSocket(httpServer);

io.on('connection', socket => {
	console.log(`${socket.id} connected`);

	socket.on('disconnect', () => {
		console.log(`${socket.id} disconnected`);
	})
})

httpServer.listen(8080, () => {
	console.log('Server run successfully!');
});

