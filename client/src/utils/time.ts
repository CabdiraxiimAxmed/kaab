function getRemainingTime(startingTime: { starting_hour: number; starting_minute: number; starting_second: number; }) {
  const dateTime = new Date();
  const { starting_hour, starting_minute, starting_second } = startingTime;
  let currentHour: number = dateTime.getHours();
  let currentMinute: number = dateTime.getMinutes();
  let currentSecond: number = dateTime.getSeconds();
  let currentTimeSeconds: number = currentHour * 60 * 60 + currentMinute * 60 + currentSecond;
  let startingTimeSeconds: number = starting_hour * 60 * 60 + starting_minute * 60 + starting_second;
  if (startingTimeSeconds >= currentTimeSeconds) {
    return startingTimeSeconds - currentTimeSeconds;
  } else {
    return false;
  }
}

function getRemainingForEndingTime(endingTime: { ending_hour: number; ending_minute: number; ending_second: number; }) {
  const dateTime = new Date();
  const { ending_hour, ending_minute, ending_second } = endingTime;
  let currentHour: number = dateTime.getHours();
  let currentMinute: number = dateTime.getMinutes();
  let currentSecond: number = dateTime.getSeconds();
  let currentTimeSeconds: number = currentHour * 60 * 60 + currentMinute * 60 + currentSecond;
  let startingTimeSeconds: number = ending_hour * 60 * 60 + ending_minute * 60 + ending_second;
  if (startingTimeSeconds >= currentTimeSeconds) {
    return startingTimeSeconds - currentTimeSeconds;
  } else {
    return false;
  }
}
export { getRemainingTime, getRemainingForEndingTime };
