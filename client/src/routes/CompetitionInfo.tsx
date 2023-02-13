import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';

type Competitors = {
  username: string;
  timeTook: string;
  totalSeconds: number;
};
type CompetitionInfoType = {
  competitors: Competitors[];
  name: string;
}
const CompetitionInfo: React.FC = () => {
  const [competitionInfo, setCompetitionInfo] = useState<CompetitionInfoType>();
  useEffect(() => {
    axios.get('/api/competition/info/1')
      .then(resp => {
        if (resp.data === 'error') {
          toast.error("Server Error");
          return;
        }
        setCompetitionInfo(resp.data);
      }).catch(error => {
        toast.error(error.message);
      })
  }, []);

  if (competitionInfo)
    competitionInfo.competitors.sort((a, b) => a.totalSeconds - b.totalSeconds);

  return (
    <div className="users-info">
      <table>
        <thead>
          <tr>
            <th>Nambarka</th>
            <th className="user-container">Magaca</th>
            <th className="user-container">Waqtiga</th>
          </tr>
        </thead>
        <tbody>
          {competitionInfo && competitionInfo.competitors.map((user, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.timeTook}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
    ;
}

export default CompetitionInfo;
