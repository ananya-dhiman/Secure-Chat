
// import React from "react";
// import { User } from "../types";
// import { LogOutIcon } from "./icons";

// interface UserListProps {
//   users: User[];
//   currentUser: User;
//   selectedUser: User | null;
//   onSelectUser: (user: User) => void;
//   onLogout: () => void;
// }

// const UserListItem: React.FC<{
//   user: User;
//   isSelected: boolean;
//   onClick: () => void;
// }> = ({ user, isSelected, onClick }) => (
//   <li
//     onClick={onClick}
//     className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors duration-200 ${
//       isSelected ? "bg-indigo-600" : "hover:bg-gray-700"
//     }`}
//   >
//     <img
//       className="w-12 h-12 rounded-full object-cover"
//       src={user.avatar}
//       alt={user.name}
//     />
//     <div className="ml-4">
//       <p className="text-md font-semibold text-gray-100">{user.name}</p>
//     </div>
//   </li>
// );

// const UserList: React.FC<UserListProps> = ({
//   users,
//   currentUser,
//   selectedUser,
//   onSelectUser,
//   onLogout,
// }) => {
//   return (
//     <div className="w-1/4 min-w-[300px] max-w-[350px] bg-gray-800 p-4 flex flex-col border-r border-gray-700">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Chats</h1>
//       </div>

//       {/* List of users */}
//       <ul className="space-y-2 overflow-y-auto flex-grow">
//         {users.map((user) => (
//           <UserListItem
//             key={user.id}
//             user={user}
//             isSelected={selectedUser?.id === user.id}
//             onClick={() => onSelectUser(user)}
//           />
//         ))}
//       </ul>

//       {/* Current user + Logout */}
//       <div className="mt-auto pt-4 border-t border-gray-700">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <img
//               className="w-12 h-12 rounded-full object-cover"
//               src={currentUser.avatar}
//               alt={currentUser.name}
//             />
//             <div className="ml-3">
//               <p className="text-md font-semibold">{currentUser.name}</p>
//             </div>
//           </div>
//           <button
//             onClick={onLogout}
//             className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
//             aria-label="Logout"
//           >
//             <LogOutIcon className="w-6 h-6 text-gray-400" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserList;
import React from "react";
import { User } from "../types";
import { LogOutIcon } from "./icons";

interface UserListProps {
  users: User[];
  currentUser: User;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onLogout: () => void;
}

// Default avatar URL
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const UserListItem: React.FC<{
  user: User;
  isSelected: boolean;
  onClick: () => void;
}> = ({ user, isSelected, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors duration-200 ${
      isSelected ? "bg-indigo-600" : "hover:bg-gray-700"
    }`}
  >
    <img
      className="w-12 h-12 rounded-full object-cover"
      src={user.avatar || DEFAULT_AVATAR}
      alt={user.email.match(/^([^@]+)/)[0]}
    />
    <div className="ml-4">
      <p className="text-md font-semibold text-gray-100">{user.email.match(/^([^@]+)/)[0]}</p>
    </div>
  </li>
);

const UserList: React.FC<UserListProps> = ({
  users,
  currentUser,
  selectedUser,
  onSelectUser,
  onLogout,
}) => {
  return (
    <div className="w-1/4 min-w-[300px] max-w-[350px] bg-gray-800 p-4 flex flex-col border-r border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chats</h1>
      </div>

      {/* List of users */}
      <ul className="space-y-2 overflow-y-auto flex-grow">
        {users.map((user) => (
          <UserListItem
            key={user._id} // make sure to use _id from backend
            user={user}
            isSelected={selectedUser?._id === user._id}
            onClick={() => onSelectUser(user)}
          />
        ))}
      </ul>

      {/* Current user + Logout */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={currentUser.avatar || DEFAULT_AVATAR}
              alt={currentUser.email.match(/^([^@]+)/)[0]}
            />
            <div className="ml-3">
              <p className="text-md font-semibold">{currentUser.email.match(/^([^@]+)/)[0]}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            aria-label="Logout"
          >
            <LogOutIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
