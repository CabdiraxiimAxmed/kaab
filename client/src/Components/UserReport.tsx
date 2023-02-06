import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RootState } from '../app/store';

type ReportData = {
  answeredCount: number;
  easy: number;
  medium: number;
  hard: number;
}
const UserReport: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const [reportData, setReportData] = useState<ReportData>();

  useEffect(() => {
    axios.get(`/api/users/report/${user.username}`)
      .then(resp => {
        if (resp.data === 'error') {
          toast.error('server error');
          return;
        }
        setReportData(resp.data);
      }).catch(error => {
        toast.error(error.message);
      })
  }, [])

  console.log(reportData);

  return (
    <div className='user-report-container'>
      <div className='card question-answered'>
        <p> Ka Jawaabtay </p>
        <p> {reportData?.answeredCount } </p>
        <p> Su'aalood </p>
      </div>
      <div className='card question-answered-levels'>
        <h2>Tirada heerarka</h2>
        <span className="easy-counter-container">{reportData?.easy} fudeed</span>
        <span className="medium-counter-container">{reportData?.medium} dhexaad</span>
        <span className="hard-counter-container">{reportData?.hard} adeeg</span>
      </div>
    </div>
  );
}

export default UserReport;
