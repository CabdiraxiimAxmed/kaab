const { javascriptRunCode } = require('./javascriptRunCode');
const client = require('../models/connect');
const { javascriptTestCode } = require('./javascriptTestCode');
const socket = require('socket.io');

let io;

const socketConnection = server => {
  io = socket(server);
  io.on('connection', socket => {
    socket.emit('message', 'connected');
    socket.on('runCode', codeData => {
      const { language } = codeData;
      socket.emit('start-loading', language);
      javascriptRunCode({ ...codeData, socket });
    });
    socket.on('testCode', codeData => {
      const { language } = codeData;
      socket.emit('start-loading', language);
      javascriptTestCode({ ...codeData, socket });
    });

    // For sharing code.
    socket.on('share', async({ roomId, username }) => {
      try {
        let resp = await client.query(`SELECT * FROM rooms WHERE room_id='${roomId}'`);
        let room = resp.rows[0];
        // find if the user exist.
        const user = room.users.find(user => user.username === username);
        let userData = JSON.stringify({username, socketId: socket.id });
        socket.join(room.room_id);
        if (!user) {
          await client.query(`UPDATE rooms set users = ARRAY_APPEND(users, '${userData}') WHERE room_id='${roomId}'`);
        } else {
          user.socketId = socket.id;
          // change the array to json before saving
          for(let i = 0; i < room.users.length; i++) {
          // change the array to json before saving
            let jsonUser = JSON.stringify(room.users[i]);
            if(i == 0) {
              await client.query(`UPDATE rooms set users = '{}' WHERE room_id='${roomId}'`);
              await client.query(`UPDATE rooms set users = ARRAY_APPEND(users, '${jsonUser}') WHERE room_id='${roomId}'`);
              continue;
            }
            await client.query(`UPDATE rooms set users = ARRAY_APPEND(users, '${jsonUser}') WHERE room_id='${roomId}'`);
          }
        }
        io.to(room.room_id).emit('joined', { users: room.users });
        socket.to(room.room_id).emit('user-joined', {
          username,
          roomId,
          users: room.users,
        });
      } catch(err) {

        //TODO: this is not handled
        socket.emit('share-error', "Error on sharing user");
      }

      socket.on('shareCodeData', async({roomId, problem}) => {
        try {
          let response = await client.query(`SELECT * FROM rooms WHERE room_id='${roomId}'`);
          let room = response.rows[0];
          socket.to(room.room_id).emit('codeData', problem);
        } catch(err) {
          socket.emit('code-error', "error on sharing code data");
        }
      });

      socket.on('shareCodeText', ({roomId, value}) => {
        socket.to(roomId).emit('code', value);
      })

    })
  });
};

module.exports = { socketConnection };
