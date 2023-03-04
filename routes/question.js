const router = require('express').Router();
const fs = require('fs');
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

router.get('/find/:id/:language', async(req, res) => {
  let { id, language } = req.params;
  try {
    const question = await client.query(
      `SELECT * FROM questions WHERE id='${id}'`
    );
    if (question.rowCount <= 0) {
      res.send('question-not-exist');
      return;
    }
    let { file, folder, id: questionId } = question.rows[0];
    let questionText = getQuestion(file, folder);
    if(language === 'javascript' || language === 'typescript')
      res.send({ ...getJavascript(file, folder, language), id, question: questionText })
    else if(language === 'python')
      res.send({ ...getPython(file, folder), id, question: questionText })
  } catch(err) {
    res.send('error');
  }
});

const getJavascript = (file, folder, language) => {
  let codeFilePath;
  if (language === 'javascript')
    codeFilePath = path.join( __dirname, `../exercises/javascript/${folder}/${file}.js`);
  else if (language === 'typescript')
     codeFilePath = path.join( __dirname, `../exercises/javascript/${folder}/${file}.ts`);
  const arePathsExist = fs.existsSync(codeFilePath);
  if (arePathsExist) {
    const srcPath = path.join(__dirname, `../exercises/javascript/${file}/${file}.tar`);
    const fileName = path.basename(codeFilePath);
    const extenname = path.extname(codeFilePath);
    const folderName = path.basename(codeFilePath, extenname);
    const code = fs.readFileSync(codeFilePath, 'utf8');
    return {
      language,
      file: fileName,
      code,
      srcPath,
      folder: folderName,
    };
  }
};

const getQuestion = (folder, file) => {
  const readMeFilePath = path.join( __dirname, `../exercises/javascript/${folder}/${file}.md`);
  const question = fs.readFileSync(readMeFilePath, 'utf8');
  return question;
}

const getPython = (file, folder, questionId) => {
  const codeFilePath = path.join(
    __dirname,
    `../exercises/python/${folder}/${file}.py`
  );
  const arePathsExist =
    fs.existsSync(codeFilePath);
  if (arePathsExist) {
    const srcPath = path.join(__dirname, `../exercises/python/${file}/${file}.tar`);
    const fileName = path.basename(codeFilePath);
    const extenname = path.extname(codeFilePath);
    const folderName = path.basename(codeFilePath, extenname);
    const code = fs.readFileSync(codeFilePath, 'utf8');
    return {
      language: 'python',
      file: fileName,
      code,
      srcPath,
      folder: folderName,
    };
  }
}

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
