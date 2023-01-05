const { javascriptRunCode } = require('./javascriptRunCode');
const socket = require('socket.io');

let io;

const socketConnection = server => {
  io = socket(server);
  io.on('connection', socket => {
    socket.emit('message', 'connected');
    socket.on('runCode', codeData => {
      javascriptRunCode({ ...codeData, socket });
    });
  });
};

module.exports = { socketConnection };
