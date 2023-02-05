const router = require('express').Router();
const fs = require('fs');
const { format } = require('path');
const path = require('path');
const client = require('../models/connect');

router.get('/', async (req, res) => {
  try {
    let questions = await client.query('SELECT * FROM questions');
    for (let i = 0; i < questions.rows.length; i++) {
      let question = getDescription(questions.rows[i].file);
      questions.rows[i]['question'] = question;
    }
    res.send(questions.rows);
  } catch (err) {
    res.send('error');
  }
});

router.get('/find/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const question = await client.query(
      `SELECT * FROM questions WHERE id='${id}'`
    );
    if (question.rowCount <= 0) {
      res.send('question-not-exist');
      return;
    }
    let { file, folder, id: questionId } = question.rows[0];
    let code = getJavascript(file, folder, questionId);
    res.send(code);
  } catch (err) {
    res.send('error');
  }
});

const getJavascript = (file, folder, id) => {
  const codeFilePath = path.join(
    __dirname,
    `../exercises/javascript/${folder}/${file}.js`
  );
  const readMeFilePath = path.join(
    __dirname,
    `../exercises/javascript/${folder}/${file}.md`
  );
  const arePathsExist =
    fs.existsSync(codeFilePath) && fs.existsSync(readMeFilePath);
  if (arePathsExist) {
    const srcPath = path.join(__dirname, `../exercises/${file}/${file}.tar`);
    const fileName = path.basename(codeFilePath);
    const extenname = path.extname(codeFilePath);
    const folderName = path.basename(codeFilePath, extenname);
    const code = fs.readFileSync(codeFilePath, 'utf8');
    const readMe = fs.readFileSync(readMeFilePath, 'utf8');
    return {
      language: 'javascript',
      file: fileName,
      code,
      readMe,
      srcPath,
      folder: folderName,
      id,
    };
  }
};

router.post('/answered', async(req, res) => {
  let { questionId, username } = req.body;
  questionId = parseInt(questionId);
  try {
    let resp = await client.query(`SELECT answered_questions FROM user_info WHERE username='${username}'`);
    let answered_ids = resp.rows[0].answered_questions;
    let index = -1;
    if(answered_ids != null)
      index = answered_ids.indexOf(parseInt(questionId));

    if (index == -1) {
      await client.query(`UPDATE user_info set answered_questions = ARRAY_APPEND(answered_questions, '${questionId}') WHERE username='${username}'`);
    }
    res.send('success').end();
  } catch(err) {
    res.send('error').end();
  }
});

const getDescription = file => {
  const readMeFilePath = path.join(
    __dirname,
    `../exercises/javascript/${file}/${file}.md`
  );
  const readMe = fs.readFileSync(readMeFilePath, 'utf8');
  return readMe;
};

// add question
// const addQuestion = async () => {
//   try {
//     await client.query(`INSERT INTO questions (name, folder, file, level)
//     VALUES('Ma simanyihiin bracketyada', 'matchBrackets', 'matchBrackets', 'adeeg');
//     `);
//     console.log('created question');
//   } catch (err) {
//     console.log(err);
//   }
// };

// addQuestion();

module.exports = router;
