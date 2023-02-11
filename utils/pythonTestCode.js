const Docker = require('dockerode');
const docker = new Docker();

const pythonTestCode = codeData => {
  const { username, language, folder } = codeData;
  const existedContainer = docker.getContainer(
    `${username}_${language}_${folder}`
  );
  existedContainer.inspect((err, result) => {
    // console.log(result);
    if (err) {
      createContainer(codeData);
      return;
    } else if (result.State.Running) {
      copyFiles(existedContainer, codeData);
      return;
    } else if ((result.State.Status == 'created' || result.State.Status == 'exited')&& !result.State.Running) {
      startContainer(existedContainer, codeData);
    }
  });
};

const createContainer = codeData => {
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
    if (err) {
      // TODO: send error => container not created.
      console.log('error on creating container');
      return;
    }
    container.start((err, data) => {
      if (err) {
        // send error => error on container start
        console.log('error on creating starting');
        return;
      }
      
      container.putArchive(
        `./exercises/python/${folder}.tar`,
        {
          path: '/app/python/',
        },
        (err, data) => {
          if (err) {
            console.log('error on creating copying the folder');
            console.log(err);
            return;
          }
          copyFiles(container, codeData);
        }
      );
    });
  });
};

const startContainer = (container, codeData) => {
  container.start((err, result) => {
    if (err) {
      console.log('error happened on creating container');
      return;
    }
    copyFiles(container, codeData);
  });
};

const copyFiles = (container, codeData) => {
  let { code, file, folder } = codeData;
  let execWritingOptions = {
    Cmd: [
      'bash',
      '-c',
      `cat <<EOF > /app/python/${folder}/${file} 
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
        console.log('error happened on exec');
        return;
      }
      testCode(container, codeData);
    });
  });
};

const testCode = (container, codeData) => {
  const { socket, file, folder, questionId } = codeData;
  let execWritingOptions = {
    Cmd: ['bash', '-c', `python /app/python/${folder}/test_${file}`],
    AttachStdout: true,
    AttachStderr: true,
  };
  container.exec(execWritingOptions, (err, exec) => {
    exec.start((err, stream) => {
      if (err) {
        return res.send('error happened');
      }
      stream.on('data', data => {
        const result = data.toString();
        let failedRegex = /F/;
        let failed = failedRegex.test(result);
        let messages = getErrorMessage(result);
        let passedRegex = /OK/;
        let isPassed = passedRegex.test(result);
        if (isPassed) {
          socket.emit('passed', { questionId });
        } else if (messages?.length > 0) {
          socket.emit("pythonFailedMessages", messages);
        }
        //socket.emit('codeResult', codeResult.join(' '));
      });
    });
  });
};

const getErrorMessage = (error) => {
  let errorRegex = /AssertionError: .+/g;
  return error.match(errorRegex);
}

module.exports = { pythonTestCode };
