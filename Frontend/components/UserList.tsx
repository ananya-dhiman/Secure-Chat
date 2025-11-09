
import React from 'react';
import { User } from '../types';
import { LogOutIcon } from './icons';

interface UserListProps {
  users: User[];
  currentUser: User;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onLogout: () => void;
}

const UserListItem: React.FC<{ user: User; isSelected: boolean; onClick: () => void }> = ({ user, isSelected, onClick }) => (
    <li
        onClick={onClick}
        className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors duration-200 ${
        isSelected ? 'bg-indigo-600' : 'hover:bg-gray-700'
        }`}
    >
        <div className="relative">
        <img className="w-12 h-12 rounded-full object-cover" src={user.avatar} alt={user.name} />
        {user.isOnline && (
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></span>
        )}
        </div>
        <div className="ml-4">
        <p className="text-md font-semibold text-gray-100">{user.name}</p>
        <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
            {user.isOnline ? 'Online' : 'Offline'}
        </p>
        </div>
    </li>
);

const UserList: React.FC<UserListProps> = ({ users, currentUser, selectedUser, onSelectUser, onLogout }) => {
  return (
    <div className="w-1/4 min-w-[300px] max-w-[350px] bg-gray-800 p-4 flex flex-col border-r border-gray-700">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Chats</h1>
        </div>
      
        <ul className="space-y-2 overflow-y-auto flex-grow">
            {users.map((user) => (
                <UserListItem
                    key={user.id}
                    user={user}
                    isSelected={selectedUser?.id === user.id}
                    onClick={() => onSelectUser(user)}
                />
            ))}
        </ul>

        <div className="mt-auto pt-4 border-t border-gray-700">
             <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img className="w-12 h-12 rounded-full object-cover" src={currentUser.avatar} alt={currentUser.name} />
                    <div className="ml-3">
                        <p className="text-md font-semibold">{currentUser.name}</p>
                        <p className="text-sm text-green-400">Online</p>
                    </div>
                </div>
                 <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200" aria-label="Logout">
                    <LogOutIcon className="w-6 h-6 text-gray-400" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default UserList;
