const express = require('express');
const client = require('../models/connect');
const router = express.Router();

router.get('/:competitionId', async(req, res) => {
  const { competitionId } =  req.params;
  try { 
    let resp = await client.query(`SELECT * FROM competition WHERE id='${competitionId}'`)
    if(!resp.rows.length) {
      res.send('failed');
      return;
    }
    res.send(resp.rows[0])
  } catch(err) {
    console.log(err)
    res.send('error');
  }
});

router.get('/info/:competitionId', async(req, res) => {
  const { competitionId } = req.params; 
  try {
    let competition = await client.query(`SELECT users, questionid FROM competition WHERE id='${competitionId}'`);
    let questionId = competition.rows[0].questionid[0];
    let questionName = await client.query(`SELECT name FROM questions WHERE id='${questionId}'`);
    let data = { name: questionName.rows[0].name, competitors: competition.rows[0].users };
    res.send(data);
  } catch(err) {
    console.log(err.message);
    res.send('error');
  }
});

module.exports  = router;
