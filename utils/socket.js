const client = require('../models/connect');
const { javascriptRunCode } = require('./javascriptRunCode');
const { javascriptTestCode } = require('./javascriptTestCode');
const { pythonRunCode } = require('./pythonRunCode');
const { pythonTestCode } = require('./pythonTestCode');
const socket = require('socket.io');

let io;

const socketConnection = server => {
  io = socket(server);
  io.on('connection', socket => {
    console.log("user connected", socket.id);
    socket.emit('message', 'connected');
    // Running and testing javascript code here
    socket.on('runJavascriptCode', codeData => {
      const { language } = codeData;
      socket.emit('start-loading', language);
      javascriptRunCode({ ...codeData, socket });
    });
    socket.on('testJavascriptCode', codeData => {
      const { language } = codeData;
      socket.emit('start-loading', language);
      javascriptTestCode({ ...codeData, socket });
    });

    // Running and testing python code here
    socket.on('runPythonCode', codeData => {
      const { language } = codeData;
      //socket.emit('start-loading', language);
      pythonRunCode({ ...codeData, socket });
    });

    socket.on('testPythonCode', codeData => {
      const { language } = codeData;
      socket.emit('start-loading', language);
      pythonTestCode({ ...codeData, socket });
    });


    // For sharing code.
    socket.on('share', async ({ roomId, username }) => {
      try {
        let resp = await client.query(`SELECT * FROM rooms WHERE room_id='${roomId}'`);
        let room = resp.rows[0];
        // find if the user exist.
        const user = room.users.find(user => user.username === username);
        let userData = JSON.stringify({ username, socketId: socket.id });
        socket.join(room.room_id);
        if (!user) {
          await client.query(`UPDATE rooms set users = ARRAY_APPEND(users, '${userData}') WHERE room_id='${roomId}'`);
        } else {
          user.socketId = socket.id;
          // change the array to json before saving
          for (let i = 0; i < room.users.length; i++) {
            // change the array to json before saving
            let jsonUser = JSON.stringify(room.users[i]);
            if (i == 0) {
              await client.query(`UPDATE rooms set users = '{}' WHERE room_id='${roomId}'`);
              await client.query(`UPDATE rooms set users = ARRAY_APPEND(users, '${jsonUser}') WHERE room_id='${roomId}'`);
              continue;
            }
            await client.query(`UPDATE rooms set users = ARRAY_APPEND(users, '${jsonUser}') WHERE room_id='${roomId}'`);
          }
        }
        let users = await client.query(`SELECT users FROM rooms WHERE room_id='${roomId}'`);
        users = users.rows[0].users;
        io.to(room.room_id).emit('users', { users });
        socket.to(room.room_id).emit('new-user', username);
        io.to(room.room_id).emit('user-joined', {
          username,
          roomId,
          users: room.users,
        });
      } catch (err) {

        //TODO: this is not handled
        socket.emit('share-error', "Error on sharing user");
      }

      socket.on('shareCodeData', async ({ roomId, codeData }) => {
        try {
          let response = await client.query(`SELECT * FROM rooms WHERE room_id='${roomId}'`);
          let room = response.rows[0];
          socket.to(room.room_id).emit('codeData', codeData);
        } catch (err) {
          socket.emit('code-error', "error on sharing code data");
        }
      });

      socket.on('shareCodeText', ({ roomId, value }) => {
        socket.to(roomId).emit('code', value);
      })

    })
    // Sending and receiving chats.
    socket.on('chatText', ({ roomId, chatMessages }) => {
      socket.to(roomId).emit('chatText', chatMessages);
    })
    socket.on('typing', ({ isTyping, username, roomId}) => {
      socket.to(roomId).emit('typing', { isTyping, username })
    });

    // if user disconnects.
    socket.on('disconnect', async() => {
      let socketId = socket.id;
      let response = await client.query('SELECT * FROM rooms');
      let rooms = response.rows;
      let room = rooms.find(room => room.users.find(user => user.socketId === socketId));
      if(room) {
        let users = room.users.filter(user => user.socketId !== socketId);
        let userLeft = room.users.filter(user => user.socketId === socketId)[0].username;
        console.log(userLeft);
        socket.to(room.room_id).emit('users', { users });
        socket.to(room.room_id).emit("user-left", userLeft);
      }
    });
  });
};

module.exports = { socketConnection };
