import React from 'react';

interface Props {
  messages: string[];
}

const PythonFailedMessages: React.FC<Props> = ({ messages }) => {
  return (
    <div className='python-failed-message-container'>
      <p style={{ color: "#cc0000", borderBottom: '1px solid #d9d9d9', padding: '10px', marginTop: '20px' }}> { messages[0] } </p>
      {messages.slice(1).map((message: string, index: number) => (
        <p key={index} style={{ color: '#cc0000', borderBottom: '1px solid #d9d9d9', padding: '10px' }}> { message } </p>
      ))}
    </div>
  );
};

export default  PythonFailedMessages;
