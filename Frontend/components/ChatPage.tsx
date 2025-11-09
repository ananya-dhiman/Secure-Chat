
// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { User } from "../types";
// import UserList from "./UserList";
// import ChatWindow from "./ChatWindow";
// import { getAuth } from "firebase/auth";


// const BACKEND_URL = "http://localhost:5000"; // change to your backend URL

// interface ChatPageProps {
//   currentUser: User;
//   onLogout: () => void;
// }

// const ChatPage: React.FC<ChatPageProps> = ({ currentUser, onLogout }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [socket, setSocket] = useState<any>(null);
//   const [roomId, setRoomId] = useState<string | null>(null);

//   // 🧠 Connect socket.io
//   useEffect(() => {
//     if (!currentUser) return;

//     const newSocket = io("http://localhost:5000", {
//       auth: {
//         token: currentUser.accessToken, // or however you store token
//       },
//       transports: ["websocket"],
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("Connected to socket:", newSocket.id);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Disconnected from socket:", newSocket.id);
//     });

//     // cleanup on unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [currentUser]);


//   // 🧠 Fetch all rooms for current user
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const auth = getAuth();
//         const token = await auth.currentUser?.getIdToken();

//         const res = await axios.get(`${BACKEND_URL}/api/rooms`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//           console.log(res);

//         // Get all other participants (excluding current user)
//         const otherUsers = res.data
//           .flatMap((room: any) => room.participants)
//           .filter((u: any) => u.firebaseId !== currentUser.firebaseId);

//         // remove duplicates
//         const uniqueUsers = Array.from(
//           new Map(otherUsers.map((u: any) => [u._id, u])).values()
//         );
      
//         console.log(uniqueUsers)
//         setUsers(uniqueUsers);
//       } catch (error) {
//         console.error("Error fetching rooms:", error);
//       }
//     };

//     fetchRooms();
//   }, [currentUser]);

//   // 🧠 Fetch messages when user selected
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedUser) return;

//       try {
//         const auth = getAuth();
// const token = await auth.currentUser?.getIdToken();

//         const res = await axios.get(`${BACKEND_URL}/api/rooms`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // find the common room
//         const room = res.data.find((r: any) =>
//           r.participants.some((p: any) => p.firebaseId === selectedUser.firebaseId)
//         );

//         if (!room) return console.warn("No room found with this user");

//         setRoomId(room._id);

//         // Join socket room
//         socket?.emit("joinRoom", { roomId: room._id, userId: currentUser._id });

//         // Fetch messages
//         const msgRes = await axios.get(`${BACKEND_URL}/api/messages/${room._id}`);
//         setMessages(msgRes.data);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();

//     return () => {
//       if (roomId && socket) socket.emit("leaveRoom", { roomId, userId: currentUser._id });
//     };
//   }, [selectedUser]);

//   // 🧠 Listen for new messages in real-time
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("newMessage", (msg: any) => {
//       if (msg.roomId === roomId) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, [socket, roomId]);

//   // 🧠 Handle send message
//   const handleSendMessage = async (text: string) => {
//     if (!roomId || !socket) return;
//     if (!text.trim()) return;

//     socket.emit("sendMessage", {
//       roomId,
//       senderId: currentUser._id,
//       text,
//     });
//   };

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       <UserList
//         users={users}
//         currentUser={currentUser}
//         selectedUser={selectedUser}
//         onSelectUser={setSelectedUser}
//         onLogout={onLogout}
//       />
//       <ChatWindow
//         currentUser={currentUser}
//         selectedUser={selectedUser}
//         messages={messages}
//         onSendMessage={handleSendMessage}
//       />
//     </div>
//   );
// };

// export default ChatPage;



// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { User } from "../types";
// import UserList from "./UserList";
// import ChatWindow from "./ChatWindow";
// import { getAuth } from "firebase/auth";

// const BACKEND_URL = "http://localhost:5000"; // your backend URL
// const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// interface ChatPageProps {
//   currentUser: User;
//   onLogout: () => void;
// }

// const getUsernameFromEmail = (email: string) => {
//   const match = email.match(/^([^@]+)/);
//   return match ? match[1] : "Anonymous";
// };

// const ChatPage: React.FC<ChatPageProps> = ({ currentUser, onLogout }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [socket, setSocket] = useState<any>(null);
//   const [roomId, setRoomId] = useState<string | null>(null);

//   // Connect socket.io
//   useEffect(() => {
//     if (!currentUser) return;

//     const newSocket = io(BACKEND_URL, {
//       auth: { token: currentUser.accessToken },
//       transports: ["websocket"],
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => console.log("Connected to socket:", newSocket.id));
//     newSocket.on("disconnect", () => console.log("Disconnected from socket:", newSocket.id));

//     return () => newSocket.disconnect();
//   }, [currentUser]);

//   // Fetch all rooms and users
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const auth = getAuth();
//         const token = await auth.currentUser?.getIdToken();

//         const res = await axios.get(`${BACKEND_URL}/api/rooms`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // Get all other participants (exclude current user)
//         const otherUsers = res.data
//           .flatMap((room: any) => room.participants)
//           .filter((u: any) => u.firebaseId !== currentUser.firebaseId)
//           .map((u: any) => ({
//             ...u,
//             name: u.email.match(/^([^@]+)/)[0] || getUsernameFromEmail(u.email),
//             avatar: u.profilePic || DEFAULT_AVATAR,
//           }));

//         // Remove duplicates by _id
//         const uniqueUsers = Array.from(new Map(otherUsers.map((u: any) => [u._id, u])).values());
//         setUsers(uniqueUsers);
//       } catch (error) {
//         console.error("Error fetching rooms:", error);
//       }
//     };

//     fetchRooms();
//   }, [currentUser]);

//   // Fetch messages when a user is selected
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedUser) return;

//       try {
//         const auth = getAuth();
//         const token = await auth.currentUser?.getIdToken();

//         const res = await axios.get(`${BACKEND_URL}/api/rooms`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const room = res.data.find((r: any) =>
//           r.participants.some((p: any) => p.firebaseId === selectedUser.firebaseId)
//         );

//         if (!room) return console.warn("No room found with this user");

//         setRoomId(room._id);

//         // Join socket room
//         socket?.emit("joinRoom", { roomId: room._id, userId: currentUser._id });

//         // Fetch messages
//         const msgRes = await axios.get(`${BACKEND_URL}/api/messages/${room._id}`);
//         setMessages(msgRes.data);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();

//     return () => {
//       if (roomId && socket) socket.emit("leaveRoom", { roomId, userId: currentUser._id });
//     };
//   }, [selectedUser]);

//   // Listen for new messages
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("newMessage", (msg: any) => {
//       if (msg.roomId === roomId) setMessages((prev) => [...prev, msg]);
//     });

//     return () => socket.off("newMessage");
//   }, [socket, roomId]);

//   const handleSendMessage = (text: string) => {
//     if (!roomId || !socket || !text.trim()) return;

//     socket.emit("sendMessage", {
//       roomId,
//       senderId: currentUser._id,
//       text,
//     });
//   };

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       <UserList
//         users={users}
//         currentUser={{
//           ...currentUser,
//           name: currentUser.name || getUsernameFromEmail(currentUser.email),
//           avatar: currentUser.avatar || DEFAULT_AVATAR,
//         }}
//         selectedUser={selectedUser}
//         onSelectUser={setSelectedUser}
//         onLogout={onLogout}
//       />
//       <ChatWindow
//         currentUser={currentUser}
//         selectedUser={selectedUser}
//         messages={messages}
//         onSendMessage={handleSendMessage}
//       />
//     </div>
//   );
// };

// export default ChatPage;
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { getAuth } from "firebase/auth";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import { User } from "../types";

const BACKEND_URL = "http://localhost:5000";
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

interface ChatPageProps {
  currentUser: User;
  onLogout: () => void;
}

const getUsernameFromEmail = (email: string) => {
  const match = email.match(/^([^@]+)/);
  return match ? match[1] : "Anonymous";
};

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  

  // Connect to socket.io
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(BACKEND_URL, {
      auth: { token: currentUser.accessToken },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("🟢 Connected to socket:", newSocket.id));
    newSocket.on("disconnect", () => console.log("🔴 Disconnected from socket:", newSocket.id));

    return () => newSocket.disconnect();
  }, [currentUser]);

  // Fetch users (from rooms)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();

        const res = await axios.get(`${BACKEND_URL}/api/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

         
        const otherUsers = res.data
          .flatMap((room: any) => room.participants)
          .filter((u: any) => u.firebaseId !== currentUser.firebaseId)
          .map((u: any) => ({
            ...u,
            name: u.email.match(/^([^@]+)/)?.[0] || getUsernameFromEmail(u.email),
            avatar: u.profilePic || DEFAULT_AVATAR,
          }));

        const uniqueUsers = Array.from(new Map(otherUsers.map((u: any) => [u._id, u])).values());
        setUsers(uniqueUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Join room and fetch messages when selectedUser changes
  useEffect(() => {
    if (!selectedUser || !socket) return;

    let currentRoomId: string | null = null;
    const fetchRoomAndMessages = async () => {
      try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();

        // Get rooms
        const res = await axios.get(`${BACKEND_URL}/api/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const room = res.data.find((r: any) =>
          r.participants.some((p: any) => p._id === selectedUser._id)
        );

        if (!room) return console.warn("No room found with this user");

        currentRoomId = room._id;
        setRoomId(currentRoomId);

        // Join socket room
        socket.emit("joinRoom", { roomId: currentRoomId, userId: currentUser._id });

        // Fetch messages
        const msgRes = await axios.get(`${BACKEND_URL}/api/messages/${currentRoomId}`);
        console.log("Messages are fetched",msgRes);
        setMessages(msgRes.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchRoomAndMessages();

    return () => {
      if (currentRoomId) socket.emit("leaveRoom", { roomId: currentRoomId, userId: currentUser._id });
      setMessages([]);
    };
  }, [selectedUser, socket]);

  // Listen for new messages in real-time
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      if (msg.roomId === roomId) setMessages(prev => [...prev, msg]);

    };
    console.log(messages)

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, roomId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = (message: any) => {
    const text=message.text;

    if (!roomId || !socket || !text.trim()) return;

    // Optimistic update
    setMessages(prev => [
      ...prev,
      {
        _id: Date.now(), // temporary ID
        roomId,
        sender: currentUser,
        text,
        createdAt: new Date(),
      },
    ]);

    socket.emit("sendMessage", { roomId, senderId: currentUser._id, text });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <UserList
        users={users}
        currentUser={{
          ...currentUser,
          name: currentUser.name || getUsernameFromEmail(currentUser.email),
          avatar: currentUser.avatar || DEFAULT_AVATAR,
        }}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onLogout={onLogout}
      />
      <ChatWindow
        currentUser={currentUser}
        selectedUser={selectedUser}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatPage;
