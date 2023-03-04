import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

/*
* starting_time, ending time, starting date, question id
* */
type CompetitionData = {
  startingTime: string;
  endingTime: string;
  startingDate: string;
  questionId: number | string;
}
const CreateCompetition: React.FC = () => {
  const [competitionData, setCompetitionData] = useState<CompetitionData>({
    startingTime: '', endingTime: '', startingDate: '', questionId: 0,
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name
    let value = event.target.value
    setCompetitionData({...competitionData, [name]: value});
  };

  const handleSubmit = () => {
    if(!competitionData.startingTime || !competitionData.endingTime || !competitionData.startingDate || !competitionData.questionId) {
      toast.warn("Dhameestir xogta");
      return;
    }
    axios.post('/api/competition/create', competitionData)
      .then(resp => {
        if(resp.data === 'error') {
          toast.error('server error');
          return;
        }
        toast.success('created');
      }) .catch(error => {
        toast.error(error.message);
      })
  }

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
        pauseOnHover
        theme="dark"
      />
      <div className="create-competition-container">
        <div>
          <span style={{ display: 'block' }}> Waqtiga bilowga </span>
          <input className='form-input' name='startingTime' onChange={handleChange} />
        </div>
        <div>
          <span style={{ display: 'block' }}> Waqtiga dhamaadka </span>
          <input className='form-input' name='endingTime' onChange={handleChange}/>
        </div>
        <div>
          <span style={{ display: 'block' }}> Taariikhda bilowga </span>
          <input className='form-input' name='startingDate' onChange={handleChange}/>
        </div>
        <div>
          <span style={{ display: 'block' }}> id ga su,aasha </span>
          <input className='form-input' name='questionId' onChange={handleChange}/>
        </div>
        <button onClick={handleSubmit}> submit </button> 
      </div>
    </>
  );
};

export default CreateCompetition;
