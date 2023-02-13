const timeCompleted = (startingTime) => {
  let { starting_hour, starting_minute, starting_second } = startingTime;
  let startingTimeTotalSeconds = starting_hour * 60 * 60 + starting_minute * 60 + starting_second;
  let dateTime = new Date();
  let hour = dateTime.getHours();
  let minute = dateTime.getMinutes();
  let second = dateTime.getSeconds();
  let currentTimeTotalSeconds = hour * 60 * 60 + minute * 60 + second;
  return covertToTime(currentTimeTotalSeconds - startingTimeTotalSeconds);
};

const covertToTime = (seconds) => {
  let hour = Math.floor(seconds / 3600);
  let minute = Math.floor((seconds % 3600) / 60);
  let second = Math.floor((seconds % 3600) % 60);
  hour = hour > 9 ? hour : `0${hour}`;
  minute = minute > 9 ? minute : `0${minute}`;
  second = second > 9 ? second : `0${second}`;
  let timeTook = `${hour}:${minute}:${second}`;
  return { timeTook, totalSeconds: seconds };
};

module.exports = timeCompleted;
