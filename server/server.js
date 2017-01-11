const path = require('path');
const http = require('http');
const request = require('request');
const express = require('express');
const socketIO = require('socket.io');
const reqIp = require('request-ip');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.get('/test-path', (req,res) => {
  let ip = reqIp.getClientIp(req).split(':').pop(),href;
    if (ip == '127.0.0.1') {
      ip = '86.155.6.27';
    }
    href = `http://www.geoplugin.net/json.gp?ip=${ip}`;
    var matched = false;
  request(href, (error,response,body) => {
      if (typeof body =='string') {
       var json = JSON.parse(body),
         data={},skip=false,sk;
        for (var k in json) {
          sk = k.replace('geoplugin_','');
          skip=false;
          switch (sk) {
            case 'longitude':
              sk = 'lng';
              break;
            case 'latitide':
              sk = 'lat';
              break;
            case 'credit':
            case 'regionCode':
            case 'regionCode':
            case 'dmaCode':
              skip= true;
              break;
          }
          if (!skip) {
            data[sk] = json[k];
          }
        }
        matched = true;
        res.send(data);
      }
  });
  setTimeout(() => {
    if (!matched) {
      res.send({valid: false,msg:"Timed out"});
    }
  },5000);
})

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {

    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("Name and room name are required");
    } 
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', params.name + ' has joined'));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude) );
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateList', users.getUserList(user.room));
      io.to(user.room).emit('generateMessage',generateMessage('Admim',`${user.name} has left the room`));
    }
  });

});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
