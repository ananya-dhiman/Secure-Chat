
// import React, { useState, useEffect, useRef } from 'react';
// import { User, Message } from '../types';
// import MessageBubble from './MessageBubble';
// import { SendIcon } from './icons';

// interface ChatWindowProps {
//   currentUser: User;
//   selectedUser: User | null;
//   messages: Message[];
//   onSendMessage: (text: string) => void;
// }

// const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, selectedUser, messages, onSendMessage }) => {
//   const [newMessage, setNewMessage] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       onSendMessage(newMessage.trim());
//       setNewMessage('');
//     }
//   };
  
//   if (!selectedUser) {
//     return (
//         <div className="flex-1 flex items-center justify-center bg-gray-900">
//             <div className="text-center text-gray-500">
//                 <p className="text-xl">Select a conversation</p>
//                 <p>Start chatting with your friends.</p>
//             </div>
//         </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col bg-gray-900">
//       <header className="flex items-center p-4 bg-gray-800 border-b border-gray-700 z-10">
//         <img className="w-12 h-12 rounded-full object-cover" src={selectedUser.avatar} alt={selectedUser.name} />
//         <div className="ml-4">
//           <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
//           <p className={`text-sm ${selectedUser.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
//             {selectedUser.isOnline ? 'Online' : 'Offline'}
//           </p>
//         </div>
//       </header>

//       <main className="flex-1 overflow-y-auto p-6">
//         <div className="space-y-6">
//           {messages.map((msg) => (
//             <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUser.id} />
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </main>

//       <footer className="p-4 bg-gray-800 border-t border-gray-700">
//         <form onSubmit={handleSubmit} className="flex items-center space-x-4">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 px-4 py-3 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-400"
//             autoComplete="off"
//           />
//           <button
//             type="submit"
//             className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
//             disabled={!newMessage.trim()}
//           >
//             <SendIcon className="w-6 h-6 text-white" />
//           </button>
//         </form>
//       </footer>
//     </div>
//   );
// };

// export default ChatWindow;
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import MessageBubble from './MessageBubble';
import { SendIcon } from './icons';

interface ChatWindowProps {
  currentUser: User;
  selectedUser: User | null;
  messages: Message[];
   onSendMessage: (message: Message) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, selectedUser, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log(messages)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !selectedUser) return;

    // Create a new message object locally (so UI updates instantly)
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser._id,
      text: trimmedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistically update UI
    onSendMessage(message);

    // Clear input
    setNewMessage('');
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-500">
          <p className="text-xl">Select a conversation</p>
          <p>Start chatting with your friends.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <header className="flex items-center p-4 bg-gray-800 border-b border-gray-700 z-10">
        <img className="w-12 h-12 rounded-full object-cover" src={selectedUser.avatar} alt={selectedUser.name} />
        <div className="ml-4">
          <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} sendId={msg.sender._id} userId={currentUser._id} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-400"
            autoComplete="off"
          />
          <button
            type="submit"
            className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <SendIcon className="w-6 h-6 text-white" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;
