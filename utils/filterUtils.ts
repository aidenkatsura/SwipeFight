import { Fighter, Discipline } from '@/types/fighter';
import { fetchUserDislikesFromDB, fetchUserLikesFromDB } from './firebaseUtils';

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
