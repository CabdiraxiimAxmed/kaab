const Docker = require('dockerode');
const client = require("../models/connect");
const timeCompleted = require('./time');
const docker = new Docker();

function javascriptTestCode(codeData) {
  const { username, folder, language } = codeData;
  const existedContainer = docker.getContainer(
    `${username}_${language}_${folder}`
  );
  existedContainer.inspect((err, result) => {
    if (err) {
      createContainer(codeData);
    }
    //todo start the container is the it is not running.
    else if (result.State.Running) {
      copyFiles(codeData, existedContainer);
    } else {
      existedContainer.start((err, data) => {
        if (err) {
        } else {
          copyFiles(codeData, existedContainer);
        }
      });
    }
  });
}
function createContainer(codeData) {
  const { username, folder, language } = codeData;
  let containerOptions = {
    Image: 'test_runner',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: false,
    Cmd: ['/bin/bash'],
    name: `${username}_${language}_${folder}`,
  };
  docker.createContainer(containerOptions, (err, container) => {
    container.start((err, data) => {
      container.putArchive(
        `./exercises/javascript/${folder}.tar`,
        {
          path: '/app/javascript',
        },
        (err, result) => {
          copyFiles(codeData, container);
        }
      );
    });
  });
}

function copyFiles(codeData, container) {
  const { code, file, folder } = codeData;
  let execWritingOptions = {
    Cmd: [
      'bash',
      '-c',
      `cat <<EOF > /app/javascript/${folder}/${file} 
 ${code}

EOF
        `,
    ],
    AttachStdout: true,
    AttachStderr: true,
  };
  container.exec(execWritingOptions, (err, exec) => {
    exec.start((err, stream) => {
      if (err) {
        return res.send('error happened');
      }
      testCode(codeData, container);
    });
  });
}
function testCode(codeData, container) {
  const { socket, language, questionId, folder, file, isCompetition, startingTime, username, competitionId } = codeData;
  let javascriptFile;
  if (language === 'typescript')
    javascriptFile = changeFileExtenstion(file)
  let execWritingOptions = {
    Cmd: language === 'javascript' ? ['bash', '-c', 'cd javascript && jest --json']
      :['bash', '-c', `cd javascript/${folder} && rm ${javascriptFile} && tsc ${file} &&  jest --json`],
    AttachStdout: true,
    AttachStderr: true,
  };
  container.exec(execWritingOptions, (err, exec) => {
    exec.start((err, stream) => {
      if (err) {
        // return res.send('error happened');
      }
      stream.on('data', async data => {
        const result = data.toString();
        const { json, testResult } = isJson(result);
        if (json) {
          let isPassed = testResult.success;
          if (isCompetition && isPassed) {
            let { timeTook, totalSeconds } = timeCompleted(startingTime);
            let userData = JSON.stringify({ username, timeTook, totalSeconds });
            try {
              let response = await client.query(`SELECT users FROM competition WHERE id='${competitionId}'`);
              let users = response.rows[0].users;
              let user = users.find(user => user.username === username);
              if (!user)
                await client.query(`UPDATE competition set users=ARRAY_APPEND(users, '${userData}') WHERE id='${competitionId}'`);
              socket.emit("round-passed", competitionId);
            } catch(err) {
              // TODO: send socket error.
              console.log(err.message);
            }
          } else if (isPassed) {
            socket.emit('passed', { questionId });
          } else {
            let warningMessage = testResult.testResults[0].assertionResults;
            const messages = getMessages(warningMessage);
            socket.emit('javascriptFailedMessage', messages);
          }
        }
      });
    });
  });
}
function isJson(str) {
  let array = str.split('{');
  array.shift();
  const string = array.join('{');
  const json = `{${string}`;
  try {
    let result = JSON.parse(json);
    return { json: true, testResult: result };
  } catch (e) {
    return { json: false, testResult: '' };
  }
}
const getMessages = result => {
  let received = '';
  let expected = '';
  let errorOutput = [];
  for (let output of result) {
    let error = {};
    let expectedRegex = /Expected: .+/g;
    let receivedRegex = /Received: .+/g;
    let referenceErrorRegex = /ReferenceError: .+/g;
    let typeErrorRegex = /TypeError: .+/g;
    let errorType = getErrorType(output);
    if (output.failureMessages.length > 0) {
      if (errorType === 'error') {
        expected = output.failureMessages[0].match(expectedRegex);
        received = output.failureMessages[0].match(receivedRegex);
        error['title'] = output.title;
        error['received'] = received.join('');
        error['expected'] = expected.join('');
        errorOutput.push(error);
      } else if (errorType === 'referenceError') {
        let referenceError =
          output.failureMessages[0].match(referenceErrorRegex);
        error['title'] = referenceError.join('');
        error['received'] = '';
        error['expected'] = '';
        errorOutput.push(error);
        break;
      } else if (errorType === 'typeError') {
        let typeError = output.failureMessages[0].match(typeErrorRegex);
        error['title'] = typeError.join('');
        error['received'] = '';
        error['expected'] = '';
        errorOutput.push(error);
      } else if (errorType === 'none') {
        error['title'] = 'Qalad ayaa dhacay';
        error['received'] = '';
        error['expected'] = '';
        errorOutput.push(error);
      }
    }
  }
  return errorOutput;
};
const getErrorType = output => {
  let errorRegex = /^Error/;
  let isReferenceErrorRegex = /^ReferenceError/;
  let isError = errorRegex.test(output.failureMessages[0]);
  let isReferenceError = isReferenceErrorRegex.test(output.failureMessages[0]);
  let isTypeErrorRegex = /^TypeError/;
  let isTypeError = isTypeErrorRegex.test(output.failureMessages[0]);
  if (isError) {
    return 'error';
  } else if (isReferenceError) {
    return 'referenceError';
  } else if (isTypeError) {
    return 'typeError';
  }
  return 'none';
};

const changeFileExtenstion = (file) => {
  let split = file.split('.')
  return `${split[0]}.js`
}

module.exports = { javascriptTestCode };
