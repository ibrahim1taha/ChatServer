const { Server } = require('socket.io');

let io;

module.exports = {
	initSocket: (httpServer) => {
		io = new Server(httpServer, {
			cors: {
				origin: "*",
				method: ["GET", "POST"]
			}
		});
		return io;
	},
	getIO: () => {
		if (!io) throw new Error('Socket connection error!');
		return io;
	}
}