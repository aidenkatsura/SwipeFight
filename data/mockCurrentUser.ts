import { Fighter } from '@/types/fighter';

// Extended Fighter type with additional profile fields
interface UserProfile extends Fighter {
  achievements?: string[];
  recentMatches?: {
    opponentName: string;
    opponentPhoto: string;
    date: string;
    result: 'win' | 'loss' | 'draw';
  }[];
}

export const mockCurrentUser: UserProfile = {
  id: 'current_user',
  name: 'Sam Rivera',
  age: 29,
  photo: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg',
  discipline: 'MMA',
  rank: 'Intermediate, 3 years',
  location: 'Brooklyn, NY',
  rating: 1750,
  wins: 8,
  losses: 4,
  draws: 1,
  achievements: [
    'Won Brooklyn MMA Tournament 2023 (Middleweight)',
    'Achieved BJJ Blue Belt',
    'Completed 10 consecutive sparring matches'
  ],
  recentMatches: [
    {
      opponentName: 'Sophia Lee',
      opponentPhoto: 'https://images.pexels.com/photos/3621183/pexels-photo-3621183.jpeg',
      date: '2 days ago',
      result: 'win'
    },
    {
      opponentName: 'Marcus Williams',
      opponentPhoto: 'https://images.pexels.com/photos/4890733/pexels-photo-4890733.jpeg',
      date: '1 week ago',
      result: 'loss'
    },
    {
      opponentName: 'Derek Foster',
      opponentPhoto: 'https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg',
      date: '2 weeks ago',
      result: 'draw'
    }
  ],
  likes: [],
  dislikes: []
};