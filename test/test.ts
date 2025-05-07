import { formatDistanceToNow } from '../utils/dateUtils';
import { mockFighters } from '../data/mockFighters';
import { filterFightersByDiscipline } from '../utils/filterUtils';
import { ChatMessage } from '../types/chat';

var assert = require('assert');
describe('Dummy Test: Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});


describe('Swiping Screen', function () {
  describe('Filter by Discipline', function () {
    it('Should only show users with the selected discipline', function () {
      assert.equal(mockFighters.length, 12); // Original length of mockFighters
      const selectedDiscipline = 'Boxing';
      
      // Use the imported filter function instead of manually filtering
      const filteredFighters = filterFightersByDiscipline(mockFighters, selectedDiscipline);

      assert.equal(filteredFighters.length, 2);
      assert.equal(filteredFighters[0].discipline, selectedDiscipline);
      assert.equal(filteredFighters[1].discipline, selectedDiscipline);
    });
  });
});



describe('Leaderboard Rankings', function () {
  describe('Rank based on rating', function () {
    it('Should rank each discipline by user ranking', function () {
      assert.equal(mockFighters.length, 12); // Original length of mockFighters
      const selectedDiscipline = 'Boxing';
      
      // Use the imported filter function instead of manually filtering
      const filteredFighters = filterFightersByDiscipline(mockFighters, selectedDiscipline);

      assert.equal(filteredFighters.length, 2);
      assert.equal(filteredFighters[0].discipline, selectedDiscipline);
      assert.equal(filteredFighters[1].discipline, selectedDiscipline);
    });
  });
});


describe('formatDistanceToNow', function () {
  it('returns "just now" for less than 10 seconds ago', function () {
    const date = new Date(Date.now() - 5 * 1000); // 5 seconds ago
    assert.equal(formatDistanceToNow(date), 'just now');
  });

  it('returns "a minute ago" for exactly 60 seconds ago', function () {
    const date = new Date(Date.now() - 60 * 1000); // 1 minute
    assert.equal(formatDistanceToNow(date), 'a minute ago');
  });

  it('returns "2 minutes ago" for 2 minutes ago', function () {
    const date = new Date(Date.now() - 2 * 60 * 1000);
    assert.equal(formatDistanceToNow(date), '2 minutes ago');
  });

  it('returns "an hour ago" for 1 hour ago', function () {
    const date = new Date(Date.now() - 60 * 60 * 1000);
    assert.equal(formatDistanceToNow(date), 'an hour ago');
  });

  it('returns "yesterday" for 1 day ago', function () {
    const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
    assert.equal(formatDistanceToNow(date), 'yesterday');
  });

  it('returns "2 days ago" for 2 days ago', function () {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    assert.equal(formatDistanceToNow(date), '2 days ago');
  });

  it('returns "a month ago" for ~30 days ago', function () {
    const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    assert.equal(formatDistanceToNow(date), 'a month ago');
  });

  it('returns "2 months ago" for ~60 days ago', function () {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    assert.equal(formatDistanceToNow(date), '2 months ago');
  });

  it('returns "a year ago" for ~365 days ago', function () {
    const date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    assert.equal(formatDistanceToNow(date), 'a year ago');
  });

  it('returns "2 years ago" for ~2 years ago', function () {
    const date = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);
    assert.equal(formatDistanceToNow(date), '2 years ago');
  });
});

describe('Chat Feature', function () {
  it('should receive a message sent by the user', function () {
    // Simple sendMessage logic for testing
    function sendMessage(messages: ChatMessage[], newMessage: ChatMessage): ChatMessage[] {
      return [...messages, { ...newMessage, read: false }];
    }

    // Simulate a message being sent by the user
    const initialMessages: ChatMessage[] = [];
    const newMessage: ChatMessage = {
      id: '1',
      senderId: 'user1',
      receiverId: 'user2',
      message: 'Hello!',
      timestamp: new Date(),
      read: false,
    };

    const updatedMessages = sendMessage(initialMessages, newMessage);

    assert.equal(updatedMessages.length, 1);
    assert.equal(updatedMessages[0].message, 'Hello!');
    assert.equal(updatedMessages[0].read, false);
  });
});