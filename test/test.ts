import { mockFighters } from '../data/mockFighters';
import { filterFightersByDiscipline } from '../utils/filterUtils';

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