import React, { useState, useEffect } from 'react';
import { EndingTime } from '../routes/Competition';
import { getRemainingForEndingTime } from '../utils/time';

interface Props {
  endingTime: EndingTime;
}

type Time = {
  hours: string | number;
  minutes: string | number;
  seconds: string | number;
};
const RemainingCountDown: React.FC<Props> = ({ endingTime }) => {
  const [remainingTime, setRemainingTime] = useState<Time>({
    hours: "0",
    minutes: "0",
    seconds: "0",
  });

  function convertToTime(seconds: number) {
    let hour: string | number = Math.floor(seconds / 3600);
    let minute: string | number = Math.floor((seconds % 3600) / 60);
    let second: string | number = Math.floor((seconds % 3600) % 60);
    hour = hour > 9 ? hour : `0${hour}`;
    minute = minute > 9 ? minute : `0${minute}`;
    second = second > 9 ? second : `0${second}`;
    setRemainingTime({ hours: hour, minutes: minute, seconds: second });
  }
  useEffect(() => {
    let intervalid = setInterval(() => {
      const result = getRemainingForEndingTime(endingTime);
      if (!result) {
        clearInterval(intervalid);
        setRemainingTime({ hours: "00", minutes: "00", seconds: "00" });
      } else {
        convertToTime(result);
      }
    }, 1000);
  }, []);
  const time = `${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`;
  let isTheTime = time === "00:00:00";
  return (
    <div className="countdown-container">
      <p className="count-down">{time}</p>
    </div>
  );
}

export default RemainingCountDown;

