import { Fighter } from "@/types/fighter";
import { GeoPoint } from "firebase/firestore";
import { fetchUserFromDB } from "./firebaseUtils";

type FighterWithDistance = Fighter & { distanceMiles: number };
/**
 * Sorts the list of fighters by their proximity to the user
 *
 * @param {string} userId - The main user's id
 * @param {Fighter[]} fighters - The array of fighters to sort. Each fighter is an object of type `Fighter`.
 * @returns {Fighter[]} A new array of fighters sorted by proximity
 */
export async function sortFightersByProximity(userId: string, fighters: Fighter[]): Promise<FighterWithDistance[]> {
  if (!fighters || !Array.isArray(fighters)) {
    return []; // Return an empty array for invalid inputs
  }
  const user = await fetchUserFromDB(userId);
if (!user || !Array.isArray(fighters)) return [];

  return fighters
    .map(f => ({
      ...f,
      distanceMiles: getDistance(user.coordinates, f.coordinates),
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

function getDistance(Coordinates1: GeoPoint, Coordinates2: GeoPoint): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3958.8; // Earth's radius in miles

  const dLat = toRad(Coordinates2.latitude - Coordinates1.latitude);
  const dLon = toRad(Coordinates2.longitude - Coordinates1.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(Coordinates1.latitude)) * Math.cos(toRad(Coordinates2.latitude)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}