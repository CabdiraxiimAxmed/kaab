const { javascriptRunCode } = require('./javascriptRunCode');
const { javascriptTestCode } = require('./javascriptTestCode');
const socket = require('socket.io');

let io;

const socketConnection = server => {
  io = socket(server);
  io.on('connection', socket => {
    socket.emit('message', 'connected');
    socket.on('runCode', codeData => {
      javascriptRunCode({ ...codeData, socket });
    });
    socket.on('testCode', codeData => {
      javascriptTestCode({ ...codeData, socket });
    });
  });
};

module.exports = { socketConnection };
