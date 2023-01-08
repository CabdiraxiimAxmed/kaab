const Docker = require('dockerode');
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
          console.log({ err });
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
    Image: 'javascript',
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
          path: '/app',
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
      `cat <<EOF > ${folder}/${file} 
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
  console.log('inside test code function');
  const { socket } = codeData;
  let execWritingOptions = {
    Cmd: ['jest', '--json'],
    AttachStdout: true,
    AttachStderr: true,
  };
  container.exec(execWritingOptions, (err, exec) => {
    exec.start((err, stream) => {
      if (err) {
        console.log(err);
        // return res.send('error happened');
      }
      stream.on('data', async data => {
        const result = data.toString();
        const { json, testResult } = isJson(result);
        if (json) {
          let isPassed = testResult.success;
          if (isPassed) {
            // passedTest
            socket.emit('passed', true);
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
  console.log({ result });
  console.log('formatting error messages');
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
        console.log(result);
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
module.exports = { javascriptTestCode };
