
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  sendId:String;
  userId:String;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sendId,userId }) => {
  console.log(message);
  console.log(sendId)
  console.log(userId)
  const isOwnMessage=JSON.stringify(sendId)===JSON.stringify(userId)
  const bubbleClasses = isOwnMessage
    ? 'bg-indigo-600 text-white self-end rounded-l-xl rounded-t-xl'
    : 'bg-gray-700 text-gray-200 self-start rounded-r-xl rounded-t-xl';
  
  const containerClasses = isOwnMessage ? 'flex justify-end' : 'flex justify-start';

  return (
    <div className={containerClasses}>
      <div className={`max-w-md lg:max-w-xl px-5 py-3 ${bubbleClasses} shadow-md`}>
        <p className="text-md">{message.text}</p>
        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-indigo-200' : 'text-gray-400'} text-right`}>
            {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
