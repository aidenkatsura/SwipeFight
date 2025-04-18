export interface Fighter {
  id: string;
  name: string;
  age: number;
  photo: string;
  discipline: Discipline;
  rank: string;
  location: string;
  distance: number; // in miles/km
  rating: number;
  wins: number;
  losses: number;
  draws: number;
}

export type Discipline = 
  | 'Boxing'
  | 'BJJ'
  | 'Muay Thai'
  | 'MMA'
  | 'Judo'
  | 'Wrestling'
  | 'Karate'
  | 'Taekwondo';