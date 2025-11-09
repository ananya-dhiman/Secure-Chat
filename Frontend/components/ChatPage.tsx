
import React, { useState, useEffect } from 'react';
import { User, Message, MessagesDict } from '../types';
import { MOCK_USERS, MOCK_MESSAGES } from '../constants';
import UserList from './UserList';
import ChatWindow from './ChatWindow';

interface ChatPageProps {
  currentUser: User;
  onLogout: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, onLogout }) => {
  const [users] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessagesDict>(MOCK_MESSAGES);

  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleSendMessage = (text: string) => {
    if (!selectedUser) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const userMessages = messages[selectedUser.id] || [];
    setMessages({
      ...messages,
      [selectedUser.id]: [...userMessages, newMessage],
    });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <UserList
        users={users}
        currentUser={currentUser}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        onLogout={onLogout}
      />
      <ChatWindow
        currentUser={currentUser}
        selectedUser={selectedUser}
        messages={selectedUser ? messages[selectedUser.id] || [] : []}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatPage;
