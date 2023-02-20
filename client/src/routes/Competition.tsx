import React, { useEffect, useState } from 'react';
import CompetitionPage from '../Components/CompetitionPage';
import { useParams } from 'react-router-dom';
import { getRemainingTime } from '../utils/time';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

interface Time {
  hours: number | string;
  minutes: number | string;
  seconds: number | string;
}


type StartingTime = {
  startng_hour: number;
  starting_minute: number;
  starting_second: number;
}

type EndingTime = {
  ending_hour: number;
  ending_minute: number;
  ending_second: number;
}

type CompetitionData = {
  id: number;
  question_id: number;
  starting_time: StartingTime;
  ending_time: EndingTime;
  created_date: string;
  starting_date: string;
}

const Competition: React.FC = () => {
  const [competitionData, setCompetitionData] = useState<CompetitionData>();
  const [competitionStatus, setCompetitionStatus] = useState<string>('wait');
  const { competitionId } = useParams();
  const [remainingTime, setRemainingTime] = useState<Time>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const convertToTime = (seconds: number) => {
    let hour: string | number = Math.floor(seconds / 3600);
    let minute: string | number = Math.floor((seconds % 3600) / 60);
    let second: string | number = Math.floor((seconds % 3600) % 60);
    hour = hour > 9 ? hour : `0${hour}`;
    minute = minute > 9 ? minute : `0${minute}`;
    second = second > 9 ? second : `0${second}`;
    setRemainingTime({ hours: hour, minutes: minute, seconds: second });
  };

  useEffect(() => {
    axios.get(`/api/competition/${competitionId}`)
      .then(resp => {
        if(resp.data === 'error') {
          toast.error("Server Error");
          return;
        }
        setCompetitionData(resp.data);
        let result: string = compareDates(resp.data.starting_date);
        if (result === 'ended') {
          setCompetitionStatus('ended');
        } else if (result === 'wait') {
          setCompetitionStatus('wait');
        }else {
          let intervalid = setInterval(() => {
            let remainingTimeInSeconds = getRemainingTime(resp.data.starting_time);
            if (!remainingTimeInSeconds) {
              clearInterval(intervalid);
              setRemainingTime({ hours: "00", minutes: "00", seconds: "00" });
            } else {
              convertToTime(remainingTimeInSeconds);
            }
          }, 1000);
        }
      }) .catch(error => {
        toast.error(error.message);
      })
  }, [])
  // this checks if the time is up.
  const time = `${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`;
  let isTheTime = time === "00:00:00";

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        theme="dark"
      />
      {isTheTime && competitionStatus !== 'ended'  ? (
        <CompetitionPage
          startingTime={competitionData?.starting_time}
          endingTime={competitionData?.ending_time}
          question_id={competitionData?.question_id}
          competitionId={competitionData?.id}
        />
      ) : (
          <div className="competition-container">
            <div className="competition-wrapper">
              {competitionStatus === 'ended' ? (
                  <>
                    <h2 className="competition-title">Tartanka wuu dhamaaday</h2>
                  </>
              ):(
                  <>
                    <h2 className="competition-title">Waxaa dhiman</h2>
                    <h2>{competitionData?.created_date}</h2>
                    <h3 className="timer">{time}</h3>
                  </>
                )
              }
            </div>
          </div>
        )}
    </>

  );
}

const compareDates = (startingDate: string): string => {
  // get current date.
  let date = new Date();
  let day: string | number = date.getDate() < 10 ? `0${date.getDate()}`: date.getDate();
  let month: string | number = date.getMonth() + 1 < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}${month}${day}`
  if (parseInt(currentDate) > parseInt(startingDate)) {
    return 'ended';
  } else if (parseInt(currentDate) < parseInt(startingDate)) {
    return 'wait';
  }
  return 'start'
}

export type { StartingTime, EndingTime }
export default Competition;
