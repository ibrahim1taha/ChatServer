const { Server } = require('socket.io');

let io;

module.exports = {
	initSocket: (httpServer) => {
		io = new Server(httpServer);
		return io;
	},
	getIO: () => {
		if (!io) throw new Error('Socket connection error!');
		return io;
	}
}