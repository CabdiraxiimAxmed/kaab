import React from 'react';
import { JavascriptFailedMessageType } from './Result';

interface Props {
  messages: JavascriptFailedMessageType[];
}
const JavascriptFailedMessage: React.FC<Props> = ({ messages }) => {
  return (
    <div className="javascript-failed-message-container">
      <p>Natiijada</p>
      {messages.map((message: JavascriptFailedMessageType, index: number) => (
        <div key={index} className="javascript-failed-message">
          <p className="message-title">{message.title}</p>
          <p className="message-received">{message.received}</p>
          <p className="message-expected">{message.expected}</p>
        </div>
      ))}
    </div>
  );
};

export default JavascriptFailedMessage;
