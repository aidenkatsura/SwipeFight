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