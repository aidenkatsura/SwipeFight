import { fetchUsersFromDB } from '../utils/firebaseUtils';
import { mockFighters } from '../data/mockFighters';

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock db from FirebaseConfig
jest.mock('../FirebaseConfig', () => ({
  db: {}, // just non-undefined object (no real getFirestore call)
}));

// Import after mocking
import { collection, getDocs } from 'firebase/firestore';

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