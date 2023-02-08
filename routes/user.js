const router = require('express').Router();
const CryptoJS = require('crypto-js');
const client = require('../models/connect');

router.post('/signup', async (req, res) => {
  let { name, username, email, password } = req.body;
  password = CryptoJS.AES.encrypt(password, 'fza').toString();
  try {
    const user = await client.query(
      `SELECT * FROM user_info WHERE username = '${username}'`
    );
    if (user.rowCount >= 1) {
      res.send('account-exist');
      return;
    }
    await client.query(
      `INSERT INTO user_info(name, username, email, password) VALUES('${name}', '${username}', '${email}', '${password}')`
    );
    res.send({ name, username, email, password });
  } catch (err) {
    res.send('error');
  }
});

router.post('/signin', async (req, res) => {
  let { username, password } = req.body;
  try {
    const user = await client.query(
      `SELECT username, password, email, name FROM user_info WHERE username='${username}' `
    );
    if (user.rowCount <= 0) {
      res.send('account-not-found');
      return;
    }
    // unhash password
    var bytes = CryptoJS.AES.decrypt(user.rows[0].password, 'fza');
    var unhashedPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (isMatched(unhashedPassword, password)) {
      res.send({
        name: user.rows[0].name,
        username: user.rows[0].username,
        email: user.rows[0].email,
      });
    } else {
      res.send('password-not-matched');
    }
  } catch (err) {
    res.send('error');
  }
});

router.get('/find/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await client.query(
      `SELECT name, username, email FROM user_info WHERE username='${username}'`
    );
    res.send({
      name: user.rows[0].name,
      username: user.rows[0].username,
      email: user.rows[0].email,
    });
  } catch (err) {
    res.send('error');
  }
});

router.post('/update', async(req, res) => {
  let { name , username, email, oldUsername } = req.body;
  let newUsername = username;
  try {
    if (oldUsername !== newUsername) {
      const user = await client.query( `SELECT * FROM user_info WHERE username = '${newUsername}'`);
      if (user.rowCount >= 1) {
        res.send('username-exist');
        return;
      }
    }
    await client.query(`UPDATE user_info set name='${name}', email = '${email}', username='${newUsername}' WHERE username='${oldUsername}'`);
    res.send('success');
  } catch(err) {
    res.send('error').end();
  }
});

router.get('/report/:username', async(req, res) => {
  const { username } = req.params;
  try {
    let answeredQuestions = await client.query(`SELECT answered_questions FROM user_info WHERE username='${username}'`);
    let answered = [];
    let easy = 0;
    let medium = 0;
    let hard = 0;
    if(!answeredQuestions.rows[0].answered_questions) {
      answered = [];
    } else {
      answered = answeredQuestions.rows[0].answered_questions
      let levelsContainer = [];
      for(let i = 0; i < answeredQuestions.rows[0].answered_questions.length; i++) {
        let id = answeredQuestions.rows[0].answered_questions[i];
        let questionLevel = await client.query(`SELECT level FROM questions WHERE id='${id}'`);
        let level = questionLevel.rows[0].level;
        levelsContainer.push(level);
      }
      easy = getLevels(levelsContainer).easy;
      medium = getLevels(levelsContainer).medium;
      hard = getLevels(levelsContainer).hard;
    }
    answered = answered.length;
    res.send({ answeredCount: answered, easy, medium, hard }).end();
  } catch(err) {
    res.send('error').end();
  }
});

router.get('/answeredQuestions/:userme', async(req, res) => {
  let { username } = req.params;
  try {
    let resp = await client.query(`SELECT answered_questions FROM user_info WHERE username='${username}'`);
    let answeredQuestions = [];
    if (!resp.rows[0])
      answeredQuestions = [];
    else answeredQuestions = resp.rows[0].answered_questions;
    res.send(answeredQuestions);
  } catch(err) {
    res.send('error');
  }
});

const getLevels = (levelsContainer) => {
  let easy = levelsContainer.filter(
    (level) => level == 'fudeed'
  ).length;
  let medium = levelsContainer.filter(
    (level) => level == 'dhexaad'
  ).length;
  let hard = levelsContainer.filter(
    (level) => level == 'adeeg'
  ).length;

  return { easy, medium, hard };
}

const isMatched = (passwrd1, passwrd2) => passwrd1 === passwrd2;

module.exports = router;
