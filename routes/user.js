const router = require('express').Router();
const CryptoJS = require('crypto-js');
const client = require('../models/connect');

router.get('/', (req, res) => {
  res.send('Hello world');
});
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
    console.log(err);
    res.send('error');
  }
});

// singin --> find user by username
router.post('/signin', async (req, res) => {
  let { username, password } = req.body;
  try {
    const user = await client.query(
      `SELECT username, password FROM user_info WHERE username='${username}' `
    );
    if (user.rowCount <= 0) {
      res.send('account-not-found');
      return;
    }
    // unhash password
    var bytes = CryptoJS.AES.decrypt(user.rows[0].password, 'fza');
    var unhashedPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (isMatched(unhashedPassword, password)) {
      res.send('success');
    } else {
      res.send('password-not-matched');
    }
  } catch (err) {
    console.log(err);
    res.send('error');
  }
});

router.get('/find/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await client.query(
      `SELECT name, username, email FROM user_info WHERE username='${username}'`
    );
    res.send(user.rows[0]);
  } catch (err) {
    res.send('error');
  }
});
const isMatched = (passwrd1, passwrd2) => passwrd1 === passwrd2;

module.exports = router;
