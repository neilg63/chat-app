const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;

const app = express();

var server = http.createServer(app);

var io = socketIO(server);

app.use('/', express.static(publicPath));

io.on('connection',(socket) => {
	console.log("New user connected");

	socket.emit('newMessage', {
		from: admin,
		text: "Welcome to our chat forum",
		createdAt: new Date().getTime()
	});

	socket.broadcast.emit('newMessage', {
		from: admin,
		text: "A new user has joined our chat forum",
		createdAt: new Date().getTime()
	});

	socket.on('createMessage', (message) => {
		console.log('create message',message);
		socket.broadcast.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
	}
	io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		}));

		socket.on('disconnect',() => {
		console.log("User was disconnected")
	});

});



/*app.get('/',(req, res) => {
	res.sendfile(publicPath + '/index.html');
});*/

server.listen(port,() => {
	console.log(`Server is up on port ${port}`);
});