
import React, { useState }from 'react';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import { User } from './types';
import { CURRENT_USER } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = () => {
    // In a real app, this would involve authentication logic.
    // Here, we'll just set a mock user.
    setCurrentUser(CURRENT_USER);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen font-sans">
      {currentUser ? (
        <ChatPage currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
