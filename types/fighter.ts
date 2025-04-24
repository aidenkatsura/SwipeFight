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