import { Fighter, Discipline } from '@/types/fighter';

/**
 * Filters fighters by discipline.
 * @param {Fighter[]} fighters - The list of fighters to filter.
 * @param {Discipline | 'All'} discipline - The discipline to filter by.
 * @returns {Fighter[]} - The filtered list of fighters.
 */
export const filterFightersByDiscipline = (
  fighters: Fighter[],
  discipline: Discipline | 'All'
): Fighter[] => {
  if (discipline === 'All') {
    return fighters;
  }
  return fighters.filter(fighter => fighter.discipline === discipline);
};