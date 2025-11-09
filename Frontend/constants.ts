
import { User, MessagesDict } from './types';

export const CURRENT_USER: User = {
  id: 'user-0',
  name: 'Alex',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  isOnline: true,
};

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Sarah',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    isOnline: true,
  },
  {
    id: 'user-2',
    name: 'Michael',
    avatar: 'https://picsum.photos/seed/michael/100/100',
    isOnline: false,
  },
  {
    id: 'user-3',
    name: 'Jessica',
    avatar: 'https://picsum.photos/seed/jessica/100/100',
    isOnline: true,
  },
  {
    id: 'user-4',
    name: 'David',
    avatar: 'https://picsum.photos/seed/david/100/100',
    isOnline: false,
  },
    {
    id: 'user-5',
    name: 'Emily',
    avatar: 'https://picsum.photos/seed/emily/100/100',
    isOnline: true,
  },
   {
    id: 'user-6',
    name: 'Chris',
    avatar: 'https://picsum.photos/seed/chris/100/100',
    isOnline: true,
  },
];

export const MOCK_MESSAGES: MessagesDict = {
  'user-1': [
    { id: 'msg-1-1', senderId: 'user-1', text: 'Hey! How are you?', timestamp: '10:00 AM' },
    { id: 'msg-1-2', senderId: 'user-0', text: 'I am good, thanks! How about you?', timestamp: '10:01 AM' },
    { id: 'msg-1-3', senderId: 'user-1', text: 'Doing great! Just working on a new project.', timestamp: '10:02 AM' },
    { id: 'msg-1-4', senderId: 'user-0', text: 'Sounds exciting! Tell me more.', timestamp: '10:03 AM' },
  ],
  'user-2': [
    { id: 'msg-2-1', senderId: 'user-0', text: 'Hi Michael, do you have the report?', timestamp: '11:30 AM' },
    { id: 'msg-2-2', senderId: 'user-2', text: 'Yes, I will send it to you in a moment.', timestamp: '11:31 AM' },
  ],
  'user-3': [
    { id: 'msg-3-1', senderId: 'user-3', text: 'Lunch today?', timestamp: '12:00 PM' },
  ],
  'user-4': [],
  'user-5': [
    { id: 'msg-5-1', senderId: 'user-5', text: 'Just saw the movie, it was amazing!', timestamp: 'Yesterday' },
    { id: 'msg-5-2', senderId: 'user-0', text: 'Oh really? I was planning to watch it.', timestamp: 'Yesterday' },
  ],
   'user-6': [
    { id: 'msg-6-1', senderId: 'user-6', text: 'Can we reschedule our meeting to 3 PM?', timestamp: '9:15 AM' },
    { id: 'msg-6-2', senderId: 'user-0', text: 'Sure, 3 PM works for me.', timestamp: '9:16 AM' },
  ],
};
