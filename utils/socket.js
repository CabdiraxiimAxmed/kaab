const socket = require('socket.io');

let io;

const socketConnection = server => {
  console.log('connecting to the server');
  io = socket(server);
  io.on('connection', socket => {
    console.log('user connected');
    socket.on('message', message => {
      console.log(message);
    });
  });
};

module.exports = { socketConnection };
