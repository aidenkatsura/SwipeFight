import { fetchUsersFromDB, addNewUserToDB } from '../utils/firebaseUtils';
import { mockFighters } from '../data/mockFighters';
import { Discipline } from '@/types/fighter';

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  Timestamp: { fromDate: jest.fn(() => 'mock-timestamp') },
  arrayUnion: jest.fn(),
  runTransaction: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock db from FirebaseConfig
jest.mock('../FirebaseConfig', () => ({
  db: {}, // just non-undefined object (no real getFirestore call)
}));

// Import after mocking
import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';

afterEach(() => {
  jest.clearAllMocks();
});

describe('fetchUsersFromDB', () => {
  it('returns an array of Fighter objects from Firestore', async () => {
    // Mock the database
    const mockDocs = mockFighters.map(fighter => ({
      data: () => fighter,
    }));
    (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

    // Fetch users from the database
    const users = await fetchUsersFromDB();

    // Check that there was a call to users collection
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'users');
    expect(getDocs).toHaveBeenCalled();
    expect(users).toEqual(mockFighters);
  });

  it('returns an empty array if no users', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    const users = await fetchUsersFromDB();

    expect(users).toEqual([]);
  });

  it('throws if Firestore fails', async () => {
    (getDocs as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(fetchUsersFromDB()).rejects.toThrow();
  });
});

describe('addNewUserToDB', () => {
  it('adds a new user with correct data', async () => {
    (doc as jest.Mock).mockReturnValue('mock-user-ref');
    const userId = 'test-id';
    const name = 'Test User';
    const age = '25';
    const location = 'Test City';
    const discipline: Discipline = 'Boxing';
    const rank = 'Beginner';
    const photo = 'http://test/photo.png';

    // Add a new user (all valid params)
    await addNewUserToDB(userId, name, age, location, discipline, rank, photo);

    // Assert correct document/userId accessed, and data set correctly
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(setDoc).toHaveBeenCalledWith('mock-user-ref', expect.objectContaining({
      id: userId,
      name,
      age: 25,
      location,
      discipline,
      rank,
      photo,
      rating: 1000,
      wins: 0,
      losses: 0,
      draws: 0,
      likes: [],
      dislikes: [],
      chats: [],
      createdAt: 'mock-timestamp',
    }));
  });
});