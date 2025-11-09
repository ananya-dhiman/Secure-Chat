
// import React, { useState }from 'react';
// import LoginPage from './components/LoginPage';
// import ChatPage from './components/ChatPage';
// import { User } from './types';
// import { CURRENT_USER } from './constants';

// const App: React.FC = () => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   const handleLogin = () => {
//     // In a real app, this would involve authentication logic.
//     // Here, we'll just set a mock user.
//     setCurrentUser(CURRENT_USER);
//   };

//   const handleLogout = () => {
//     setCurrentUser(null);
//   };

//   return (
//     <div className="min-h-screen font-sans">
//       {currentUser ? (
//         <ChatPage currentUser={currentUser} onLogout={handleLogout} />
//       ) : (
//         <LoginPage onLogin={handleLogin} />
//       )}
//     </div>
//   );
// };

// export default App;
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import LoginPage from "./components/LoginPage";
import ChatPage from "./components/ChatPage";
import { User } from "./types";
import { auth } from "./firebase";
import axios from "axios";
const BACKEND_URL = "http://localhost:5000";


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Map Firebase user to your app's User type
        const auth = getAuth();
                const token = await auth.currentUser?.getIdToken();
          const res = await axios.get(`${BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data.user);
        setCurrentUser({
          _id:res.data.user._id,
          firebaseId: firebaseUser.uid,
          name: firebaseUser.displayName || "Anonymous",
          email: firebaseUser.email || "",
          avatar: firebaseUser.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-gray-900 text-white">
      {currentUser ? (
        <ChatPage currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default App;
