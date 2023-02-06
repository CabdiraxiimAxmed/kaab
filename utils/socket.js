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
      const { language } = codeData;
      socket.emit('start-loading', language);
      javascriptTestCode({ ...codeData, socket });
    });
  });
};

module.exports = { socketConnection };
