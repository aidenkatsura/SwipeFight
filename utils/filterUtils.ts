import { Fighter, Discipline } from '@/types/fighter';

/**
 * Filters the list of fighters by the selected discipline.
 * The order of the filtered fighters is preserved from the original array.
 *
 * @param {Fighter[]} fighters - The array of fighters to filter. Each fighter is an object of type `Fighter`.
 * @param {'All' | Discipline} discipline - The discipline to filter by. Use 'All' to return all fighters.
 * @returns {Fighter[]} A new array of fighters filtered by the selected discipline.
 */
export function filterFightersByDiscipline(fighters: Fighter[], discipline: 'All' | Discipline): Fighter[] {
  if (!fighters || !Array.isArray(fighters)) {
    return []; // Return an empty array for invalid inputs
  }
  if (discipline == null) { // Check for null or undefined
    throw new Error('Discipline cannot be null or undefined');
  }
  if (discipline === 'All') {
    return fighters; // Return all fighters without filtering
  }
  return fighters.filter((fighter) => fighter.discipline === discipline);
}