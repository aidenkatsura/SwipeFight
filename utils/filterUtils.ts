import { Fighter, Discipline } from '@/types/fighter';

/**
 * Filters the list of fighters by the selected disciplines.
 * The order of the filtered fighters is preserved from the original array.
 *
 * @param {Fighter[]} fighters - The array of fighters to filter. Each fighter is an object of type `Fighter`.
 * @param {Discipline[]} disciplines - The disciplines to filter by. Empty array returns all fighters.
 * @returns {Fighter[]} A new array of fighters filtered by the selected disciplines.
 */
export function filterFightersByDiscipline(fighters: Fighter[], disciplines: Discipline[]): Fighter[] {
  if (!fighters || !Array.isArray(fighters)) {
    return []; // Return an empty array for invalid inputs
  }
  if (disciplines.length === 0) {
    return fighters; // Return all fighters if no disciplines selected
  }
  return fighters.filter((fighter) => disciplines.includes(fighter.discipline));
}