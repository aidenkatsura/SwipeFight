import { GeoPoint } from "firebase/firestore";

export interface Fighter {
  id: string;
  name: string;
  age: number;
  photo: string;
  discipline: Discipline;
  rank: string;
  location: string;
  coordinates: GeoPoint;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  likes: string[];
  dislikes: string[];
}

// If adding anything here, make sure to update the DisciplineFilter.tsx file as well
export type Discipline = 
  | 'Aikido'
  | 'BJJ'
  | 'Boxing'
  | 'Judo'
  | 'Karate'
  | 'Kendo'
  | 'Kickboxing'
  | 'Kung Fu'
  | 'Krav Maga'
  | 'Taekwondo'
  | 'MMA'
  | 'Muay Thai'
  | 'Wrestling';