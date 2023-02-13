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

module.exports  = router;
