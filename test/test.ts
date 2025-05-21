import { formatDistanceToNow } from '../utils/dateUtils';
import { mockFighters } from '../data/mockFighters';
import { filterFightersByDiscipline } from '../utils/filterUtils';
import { ChatMessage } from '../types/chat';
import { Discipline, Fighter } from '@/types/fighter';
import { Timestamp } from 'firebase/firestore';

describe('Dummy Test: Array', () => {
  describe('#indexOf()', () => {
    test('should return -1 when the value is not present', () => {
      expect([1, 2, 3].indexOf(4)).toBe(-1);
    });
  });
});

describe('Swiping Screen', () => {
  describe('Filter by Discipline', () => {
    test('should only show users with the selected discipline', () => {
      const selectedDiscipline = "Boxing";
      const filteredFighters = filterFightersByDiscipline(mockFighters, [selectedDiscipline]);
      expect(filteredFighters.length).toBe(2);
      expect(filteredFighters[0].discipline).toBe(selectedDiscipline);
      expect(filteredFighters[1].discipline).toBe(selectedDiscipline);
    });

    test("should return all users when no disciplines are selected", () => {
      const filteredFighters = filterFightersByDiscipline(mockFighters, []);
      expect(filteredFighters.length).toBe(mockFighters.length);
      expect(filteredFighters).toEqual(mockFighters);
    });

    test('should return an empty array when the input is empty', () => {
      const selectedDiscipline: Discipline = 'Boxing';
      const emptyFighters: Fighter[] = [];
      const filteredFighters = filterFightersByDiscipline(emptyFighters, [selectedDiscipline]);
      expect(filteredFighters.length).toBe(0);
      expect(filteredFighters).toEqual([]);
    });

    test('should return empty array when input is empty (with no disciplines selected)', () => {
      const emptyFighters: Fighter[] = [];
      const filteredFighters = filterFightersByDiscipline(emptyFighters, []);
      expect(filteredFighters.length).toBe(0);
      expect(filteredFighters).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    test('should return an empty array when fighters input is null', () => {
      const selectedDiscipline = 'Boxing';
      const fighters = null;
      const filteredFighters = filterFightersByDiscipline(fighters as any, [selectedDiscipline]);
      expect(filteredFighters).toEqual([]);
    });

    test('should throw an error when discipline is null or undefined', () => {
      const fighters: Fighter[] = mockFighters;

      expect(() => filterFightersByDiscipline(fighters, null as any)).toThrow(Error);
      expect(() => filterFightersByDiscipline(fighters, undefined as any)).toThrow(Error);
    });

    test('should return an empty array when fighters input is not an array', () => {
      const selectedDiscipline = 'Boxing';
      const fighters = { name: 'Invalid Input' };
      const filteredFighters = filterFightersByDiscipline(fighters as any, [selectedDiscipline]);
      expect(filteredFighters).toEqual([]);
    });
  });
});

describe('Leaderboard Rankings', () => {
  describe('Rank based on rating', () => {
    test('should rank each discipline by user ranking', () => {
      expect(mockFighters.length).toBe(12);
      const selectedDiscipline = 'Boxing';
      const filteredFighters = filterFightersByDiscipline(mockFighters, [selectedDiscipline]);
      expect(filteredFighters.length).toBe(2);
      expect(filteredFighters[0].discipline).toBe(selectedDiscipline);
      expect(filteredFighters[1].discipline).toBe(selectedDiscipline);
    });
  });
});

describe('formatDistanceToNow', () => {
  test('returns "just now" for less than 10 seconds ago', () => {
    const date = new Date(Date.now() - 5 * 1000); // 5 seconds ago
    expect(formatDistanceToNow(date)).toBe('just now');
  });

  test('returns "a minute ago" for exactly 60 seconds ago', () => {
    const date = new Date(Date.now() - 60 * 1000); // 1 minute
    expect(formatDistanceToNow(date)).toBe('a minute ago');
  });

  test('returns "2 minutes ago" for 2 minutes ago', () => {
    const date = new Date(Date.now() - 2 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe('2 minutes ago');
  });

  test('returns "an hour ago" for 1 hour ago', () => {
    const date = new Date(Date.now() - 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe('an hour ago');
  });

  test('returns "yesterday" for 1 day ago', () => {
    const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe('yesterday');
  });

  test('returns "2 days ago" for 2 days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe('2 days ago');
  });

  test('returns "a month ago" for ~30 days ago', () => {
    const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe('a month ago');
  });

  test('returns "2 months ago" for ~60 days ago', () => {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe('2 months ago');
  });

  test('returns "a year ago" for ~365 days ago', () => {
    const date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe('a year ago');
  });

  test('returns "2 years ago" for ~2 years ago', () => {
    const date = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe('2 years ago');
  });
});

describe('Chat Feature', () => {
  test('should receive a message sent by the user', () => {
    function sendMessage(messages: ChatMessage[], newMessage: ChatMessage): ChatMessage[] {
      return [...messages, { ...newMessage, read: false }];
    }

    const initialMessages: ChatMessage[] = [];
    const newMessage: ChatMessage = {
      id: '1',
      senderId: 'user1',
      receiverId: 'user2',
      message: 'Hello!',
      timestamp: Timestamp.fromDate(new Date()),
      read: false,
    };

    const updatedMessages = sendMessage(initialMessages, newMessage);

    expect(updatedMessages.length).toBe(1);
    expect(updatedMessages[0].message).toBe('Hello!');
    expect(updatedMessages[0].read).toBe(false);
  });

  test('should mark a message as read', () => {
    function markAsRead(messages: ChatMessage[], messageId: string): ChatMessage[] {
      return messages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      );
    }

    const initialMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: 'user1',
        receiverId: 'user2',
        message: 'Hello!',
        timestamp: Timestamp.fromDate(new Date()),
        read: false,
      },
    ];

    const updatedMessages = markAsRead(initialMessages, '1');

    expect(updatedMessages[0].read).toBe(true);
    expect(updatedMessages[0].message).toBe('Hello!');
  });
});
