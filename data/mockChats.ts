import { Chat } from '@/types/chat';

export const mockChats: Chat[] = [
  {
    id: '1',
    matchId: 'match_1',
    participants: [
      {
        id: 'current_user',
        name: 'You',
        photo: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
      },
      {
        id: '2',
        name: 'Sophia Lee',
        photo: 'https://images.pexels.com/photos/3621183/pexels-photo-3621183.jpeg',
      }
    ],
    lastMessage: {
      id: 'msg_1',
      senderId: '2',
      receiverId: 'current_user',
      message: "Hey, I'm available for sparring this Saturday at 2pm. Does that work for you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: '2',
    matchId: 'match_2',
    participants: [
      {
        id: 'current_user',
        name: 'You',
        photo: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
      },
      {
        id: '3',
        name: 'Marcus Williams',
        photo: 'https://images.pexels.com/photos/4890733/pexels-photo-4890733.jpeg',
      }
    ],
    lastMessage: {
      id: 'msg_2',
      senderId: 'current_user',
      receiverId: '3',
      message: "Great rolling with you today! Let's do it again next week.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    matchId: 'match_3',
    participants: [
      {
        id: 'current_user',
        name: 'You',
        photo: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
      },
      {
        id: '7',
        name: 'Derek Foster',
        photo: 'https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg',
      }
    ],
    lastMessage: {
      id: 'msg_3',
      senderId: '7',
      receiverId: 'current_user',
      message: "I'll bring my own headgear and gloves. See you at the gym!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: '4',
    matchId: 'match_4',
    participants: [
      {
        id: 'current_user',
        name: 'You',
        photo: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
      },
      {
        id: '10',
        name: 'Aisha Powell',
        photo: 'https://images.pexels.com/photos/9325838/pexels-photo-9325838.jpeg',
      }
    ],
    lastMessage: {
      id: 'msg_4',
      senderId: '10',
      receiverId: 'current_user',
      message: "I usually train at The Muay Thai Lab on 23rd Street. They have a great ring for sparring.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      read: false,
    },
    unreadCount: 3,
  }
];