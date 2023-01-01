const router = require('express').Router();
const client = require('../models/connect');

router.get('/', async (req, res) => {
  try {
    let questions = await client.query('SELECT * FROM questions');
    res.send(questions.rows);
  } catch (err) {
    res.send('error');
  }
});

// add question
// const addQuestion = async () => {
//   try {
//     await client.query(`INSERT INTO questions (name, folder, file, level)
//     VALUES('isku dar 2bo tiro', 'sum', 'sum', 'fudeed');
//     `);
//     console.log('created question');
//   } catch (err) {
//     console.log(err);
//   }
// };

// addQuestion();

module.exports = router;
