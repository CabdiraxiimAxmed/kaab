const express = require('express');
const client = require('../models/connect');
const router = express.Router();

router.post('/', async(req, res) => {
  const { roomId } = req.body
  try {
    let resp = await client.query(`SELECT * FROM rooms WHERE room_id='${roomId}'`);
    if (resp.rows.length > 0) {
      res.send('room-exist').end();
    } else {
      await client.query(`INSERT INTO rooms(users, room_id) VALUES('{}', '${roomId}')`);
      res.send('room-created').end();
    }
  } catch(err) {
    console.log(err.message);
    res.send('error');
  }
});

module.exports = router;
