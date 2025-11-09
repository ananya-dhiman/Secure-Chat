
// import React from 'react';

// interface LoginPageProps {
//   onLogin: () => void;
// }

// const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onLogin();
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900">
//       <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
//           <p className="mt-2 text-gray-400">Sign in to continue to your chats</p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email-address" className="sr-only">Email address</label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address (e.g., alex@example.com)"
//                 defaultValue="alex@example.com"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 defaultValue="password"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors duration-200"
//             >
//               Sign in
//             </button>
//           </div>
//         </form>
//          <p className="mt-2 text-center text-sm text-gray-500">
//             This is a demo. Any email/password will work.
//           </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

interface LoginPageProps {
  onLogin?: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    let userCredential;

    try {
      // 1️⃣ Try to create user first
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // 2️⃣ If user already exists, login instead
      if (err.code === "auth/email-already-in-use") {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        throw err;
      }
    }

    const user = userCredential.user;

    // 3️⃣ Get Firebase ID token
    const token = await user.getIdToken();
    console.log("This is the users token",token);

    // 4️⃣ Send token to backend
    const res = await axios.post(
      "http://localhost:5000/api/users/login",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 5️⃣ Store token for API / Socket.IO
    localStorage.setItem("firebaseToken", res.data.token);

    // 6️⃣ Callback to parent
    onLogin(res.data.user);

  } catch (err: any) {
    console.error(err);
    setError(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-gray-400">Sign in to continue to your chats</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors duration-200"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-500">
          This is a demo. Any email/password will work.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
