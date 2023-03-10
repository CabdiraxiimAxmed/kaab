const express = require('express');
const { v4: uuidv4 } = require('uuid');
const client = require('../models/connect');
const router = express.Router();

router.get('/:competitionId', async (req, res) => {
  const { competitionId } = req.params;
  try {
    let resp = await client.query(`SELECT * FROM competition WHERE id='${competitionId}'`)
    if (!resp.rows.length) {
      res.send('failed');
      return;
    }
    res.send(resp.rows[0])
  } catch (err) {
    console.log(err)
    res.send('error');
  }
});

router.get('/info/:competitionId', async (req, res) => {
  const { competitionId } = req.params;
  try {
    let competition = await client.query(`SELECT users, question_id FROM competition WHERE id='${competitionId}'`);
    let questionId = competition.rows[0].question_id;
    let questionName = await client.query(`SELECT name FROM questions WHERE id='${questionId}'`);
    let data = { name: questionName.rows[0].name, competitors: competition.rows[0].users };
    res.send(data);
  } catch (err) {
    console.log(err.message);
    res.send('error');
  }
});

router.post('/create', async(req, res) => {
  let { startingTime, endingTime, startingDate, questionId } = req.body;
  startingTime = JSON.stringify(getStartingTime(startingTime));
  endingTime =  JSON.stringify(getEndingTime(endingTime));
  let id  = uuidv4();
  try {
    await client.query(`INSERT INTO competition (id, starting_time, ending_time, question_id, starting_date)
        VALUES('${id}','${startingTime}', '${endingTime}', '${questionId}', '${startingDate}')`);
    res.send(id);
  } catch(err) {
    res.send('error');
  }
});

const getStartingTime = (startingTime) => {
  let split = startingTime.split(' ');
  let starting_hour = split[0];
  let starting_minute = split[1];
  let starting_second = split[2];
  if (!starting_minute) starting_minute = 0;
  if (!starting_second) starting_second = 0;
  return { starting_hour, starting_minute, starting_second };
};

const getEndingTime = (endingTime) => {
  let split = endingTime.split(' ');
  let ending_hour = split[0];
  let ending_minute = split[1];
  let ending_second = split[2];
  if (!ending_minute) ending_minute = 0;
  if (!ending_second) ending_second = 0;
  return { ending_hour, ending_minute, ending_second };
};
module.exports = router;
