import { Fighter, Discipline } from '@/types/fighter';
import { fetchUserDislikesFromDB, fetchUserLikesFromDB } from './firebaseUtils';

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

/**
 * filters the user's fighters list
 * Filters out:
 *    - The user
 *    - Fighters already liked or disliked by user
 *    - Fighters who've disliked user
 * 
 * @param {Fighter[]} fighters - The array of fighters to filter. Each fighter is an object of type `Fighter`.
 * @param {string} userId - The ID of the user whose fighter's list is being filtered
 * @returns {Promise<Fighter[]>} A Promise that resolves to a new array of fighters filtered by user likes.
 */
export async function filterFightersByLikes(fighters: Fighter[], userId: string): Promise<Fighter[]> {
  if (!fighters || !Array.isArray(fighters)) {
    return [];
  }
  if (!userId) {
    throw new Error('userId cannot be null or undefined');
  }

  const userLikes = await fetchUserLikesFromDB(userId);
  const userDislikes = await fetchUserDislikesFromDB(userId);

  const visibleFighters = await Promise.all(
    fighters.map(async (fighter) => {
      if (
        fighter.id === userId ||
        userLikes.includes(fighter.id) ||
        userDislikes.includes(fighter.id)
      ) {
        return null;
      }

      const fighterDislikes = await fetchUserDislikesFromDB(fighter.id);
      if (fighterDislikes.includes(userId)) {
        return null;
      }

      return fighter;
    })
  );

  return visibleFighters.filter((fighter): fighter is Fighter => fighter !== null);
}