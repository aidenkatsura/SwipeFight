// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  runTransaction: jest.fn(),
  arrayUnion: jest.fn(),
  Timestamp: { fromDate: jest.fn(() => 'mock-timestamp') },
  increment: jest.fn(),
}));

// Mock db from FirebaseConfig
jest.mock('../FirebaseConfig', () => ({
  db: {}, // just non-undefined object (no real getFirestore call)
}));

// Import Firestore funcs after mocking
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  runTransaction,
  arrayUnion,
  Timestamp,
  increment,
} from 'firebase/firestore';

import {
  fetchUsersFromDB,
  addNewUserToDB,
  updateUserInDB,
  changeUserDocId,
  addLikeToUser,
  addDislikeToUser,
  fetchChatFromDB,
  fetchUserFromDB,
  fetchUserLikesFromDB,
  fetchUserDislikesFromDB,
  fetchUserChatsFromDB,
  sendMessage,
  addChat,
} from '../utils/firebaseUtils';

import { mockFighters } from '../data/mockFighters';
import { Discipline } from '@/types/fighter';
import { Chat } from '@/types/chat';
import { defaultPhoto } from '@/app/(auth)/account-setup';

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
  const userId = 'test-id';
  const name = 'Test User';
  const age = '25';
  const location = 'Test City';
  const discipline: Discipline = 'Boxing';
  const rank = 'Beginner';
  const photo = 'http://test/photo.png';

  it('adds a new user with correct data', async () => {
    (doc as jest.Mock).mockReturnValue('mock-user-ref');
    
    // Add a new user (all valid params)
    await addNewUserToDB(userId, name, age, location, discipline, rank, photo);

    // Assert correct document/userId accessed, and data set correctly
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(setDoc).toHaveBeenCalledWith('mock-user-ref', expect.objectContaining({
      id: userId,
      name,
      age: parseInt(age, 10),
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

  it('uses defaultPhoto if no photo provided', async () => {
    (doc as jest.Mock).mockReturnValue('mock-user-ref');
    
    // Add a new user (all valid, null photo)
    await addNewUserToDB(userId, name, age, location, discipline, rank, null);

    // Assert correct document/userId accessed, and data set correctly (w/ defaultPhoto)
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(setDoc).toHaveBeenCalledWith('mock-user-ref', expect.objectContaining({
      id: userId,
      name,
      age: parseInt(age, 10),
      location,
      discipline,
      rank,
      photo: defaultPhoto,
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

describe('updateUserInDB', () => {
  const userId = 'test-id';
  const updatedData = { name: 'Updated User', age: 30 };

  it('updates user data successfully if the user exists', async () => {
    (doc as jest.Mock).mockReturnValue('mock-user-ref');
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true, // Simulate document exists
    });

    const result = await updateUserInDB(userId, updatedData);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(getDoc).toHaveBeenCalledWith('mock-user-ref');
    expect(setDoc).toHaveBeenCalledWith('mock-user-ref', updatedData, { merge: true });
    expect(result).toBe(true);
  });

  it('returns false if the user does not exist', async () => {
    (doc as jest.Mock).mockReturnValue('mock-user-ref');
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false, // Simulate document does not exist
    });

    const result = await updateUserInDB(userId, updatedData);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(getDoc).toHaveBeenCalledWith('mock-user-ref');
    expect(setDoc).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('throws an error if Firestore fails', async () => {
    (doc as jest.Mock).mockReturnValue('mock-user-ref');
    (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(updateUserInDB(userId, updatedData)).rejects.toThrow();

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(getDoc).toHaveBeenCalledWith('mock-user-ref');
    expect(setDoc).not.toHaveBeenCalled();
  });
});

describe('changeUserDocId', () => {
  const oldDocId = 'old-id';
  const newDocId = 'new-id';

  it('returns true if conditions are met', async () => {
    // Mock Firestore txn behavior
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn((docRef) => {
          if (docRef === 'mock-old-id-ref') {
            return { exists: (): boolean => true, data: () => ({ name: 'Test User' }) }; // Old doc exists
          }
          if (docRef === 'mock-new-id-ref') {
            return { exists: (): boolean => false }; // New doc does not exist
          }
        }),
        set: jest.fn(),
        delete: jest.fn(),
      };
      await transactionFn(transaction);
    });

    const result = await changeUserDocId(oldDocId, newDocId);

    // Assert transaction behavior
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', oldDocId);
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', newDocId);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
    expect(result).toBe(true);
  });

  it('returns false if the old document does not exist', async () => {
    // Mock Firestore txn behavior
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn((docRef) => {
          if (docRef === 'mock-old-id-ref') {
            return { exists: () => false }; // Old doc does not exist
          }
        }),
        set: jest.fn(),
        delete: jest.fn(),
      };
      await transactionFn(transaction);
    });

    const result = await changeUserDocId(oldDocId, newDocId);

    // Assert transaction behavior
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', oldDocId);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
    expect(result).toBe(false);
  });

  it('returns false if the new document ID already exists', async () => {
    // Mock Firestore txn behavior
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn((docRef) => {
          if (docRef === 'mock-old-id-ref') {
            return { exists: (): boolean => true, data: () => ({ name: 'Test User' }) }; // Old doc exists
          }
          if (docRef === 'mock-new-id-ref') {
            return { exists: (): boolean => true }; // New doc already exists
          }
        }),
        set: jest.fn(),
        delete: jest.fn(),
      };
      await transactionFn(transaction);
    });

    const result = await changeUserDocId(oldDocId, newDocId);

    // Assert transaction behavior
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', newDocId);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
    expect(result).toBe(false);
  });

  it('returns false if the transaction fails', async () => {
    // Mock Firestore txn behavior
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn((docRef) => {
          if (docRef === 'mock-old-id-ref') {
            return { exists: (): boolean => true, data: () => ({ name: 'Test User' }) }; // Old doc exists
          }
          if (docRef === 'mock-new-id-ref') {
            return { exists: (): boolean => false }; // New doc does not exist
          }
        }),
        set: jest.fn(),
        delete: jest.fn(),
      };
      throw new Error('Transaction failed'); // Simulate transaction failure
    });

    const result = await changeUserDocId('old-id', 'new-id');

    // Assert that the function returns false
    expect(result).toBe(false);

    // Assert transaction behavior
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });
});

describe('addLikeToUser', () => {
  const userId1 = 'user1-id';
  const userId2 = 'user2-id';

  beforeEach(() => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (arrayUnion as jest.Mock).mockImplementation((val) => ['EXISTING', val]);
  });

  it('returns true when like is successfully added', async () => {
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn(async (docRef) => ({
          exists: () => true,
          data: () => ({ likes: ['EXISTING'] }),
        })),
        update: jest.fn(),
      };
      await transactionFn(transaction);

      // Assert the update was called with the correct likes array
      expect(transaction.update).toHaveBeenCalledWith(
        'mock-user1-id-ref',
        { likes: ['EXISTING', userId2] }
      );
    });

    const result = await addLikeToUser(userId1, userId2);
    
    expect(result).toBe(true);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });

  it('returns false if user does not exist', async () => {
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn(async (docRef) => ({
          exists: () => false,
        })),
        update: jest.fn(),
      };
      await transactionFn(transaction);

      // Assert update was NOT called
      expect(transaction.update).not.toHaveBeenCalled();
    });

    const result = await addLikeToUser(userId1, userId2);

    expect(result).toBe(false);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });

  it('returns false if transaction fails', async () => {
    (runTransaction as jest.Mock).mockImplementation(async () => {
      throw new Error('Transaction failed');
    });

    const result = await addLikeToUser(userId1, userId2);

    expect(result).toBe(false);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });
});

describe('addDislikeToUser', () => {
  const userId1 = 'user1-id';
  const userId2 = 'user2-id';

  beforeEach(() => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (arrayUnion as jest.Mock).mockImplementation((val) => ['EXISTING', val]);
  });

  it('returns true when dislike is successfully added', async () => {
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn(async (docRef) => ({
          exists: () => true,
          data: () => ({ dislikes: ['EXISTING'] }),
        })),
        update: jest.fn(),
      };
      await transactionFn(transaction);

      // Assert the update was called with the correct dislikes array
      expect(transaction.update).toHaveBeenCalledWith(
        'mock-user1-id-ref',
        { dislikes: ['EXISTING', userId2] }
      );
    });

    const result = await addDislikeToUser(userId1, userId2);

    expect(result).toBe(true);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });

  it('returns false if user does not exist', async () => {
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn(async (docRef) => ({
          exists: () => false,
        })),
        update: jest.fn(),
      };
      await transactionFn(transaction);

      // Assert update was NOT called
      expect(transaction.update).not.toHaveBeenCalled();
    });

    const result = await addDislikeToUser(userId1, userId2);

    expect(result).toBe(false);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });

  it('returns false if transaction fails', async () => {
    (runTransaction as jest.Mock).mockImplementation(async () => {
      throw new Error('Transaction failed');
    });

    const result = await addDislikeToUser(userId1, userId2);

    expect(result).toBe(false);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });
});

describe('fetchChatFromDB', () => {
  const chatId = 'chat-123';
  const mockChat: Chat = {
    id: chatId,
    participants: [],
    messages: [],
    unreadCounts: {},
    lastMessage: {
      id: '',
      senderId: '',
      receiverId: '',
      message: '',
      timestamp: Timestamp.fromDate(new Date()),
      read: false
    },
  };

  it('returns chat data if chat exists', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockChat,
    });

    const result = await fetchChatFromDB(chatId);
    
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'chats', chatId);
    expect(getDoc).toHaveBeenCalledWith('mock-chat-123-ref');
    expect(result).toEqual(mockChat);
  });

  it('throws if chat does not exist', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    await expect(fetchChatFromDB(chatId)).rejects.toThrow();
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'chats', chatId);
    expect(getDoc).toHaveBeenCalledWith('mock-chat-123-ref');
  });

  it('throws if Firestore throws', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(fetchChatFromDB(chatId)).rejects.toThrow();
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'chats', chatId);
    expect(getDoc).toHaveBeenCalledWith('mock-chat-123-ref');
  });
});

describe('fetchUserFromDB', () => {
  const userId = 'user-123';
  const mockUser = {
    id: userId,
    name: 'Test User',
    age: 25,
    location: 'Seattle',
    discipline: 'MMA',
    rank: 'Blue Belt',
    photo: 'photo-url',
    rating: 1010,
    wins: 2,
    losses: 1,
    draws: 1,
    likes: [],
    dislikes: [],
    chats: [],
    createdAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
  };

  it('returns user data if user exists', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockUser,
    });

    const result = await fetchUserFromDB(userId);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(getDoc).toHaveBeenCalledWith('mock-user-123-ref');
    expect(result).toEqual(mockUser);
  });

  it('throws if user does not exist', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    await expect(fetchUserFromDB(userId)).rejects.toThrow();
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(getDoc).toHaveBeenCalledWith('mock-user-123-ref');
  });

  it('throws if Firestore throws', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(fetchUserFromDB(userId)).rejects.toThrow();
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId);
    expect(getDoc).toHaveBeenCalledWith('mock-user-123-ref');
  });
});

describe('fetchUserLikesFromDB', () => {
  const userId = 'user-123';

  it('returns likes array if present', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ likes: ['a', 'b', 'c'] }),
    });

    const result = await fetchUserLikesFromDB(userId);
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array if likes is missing', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({}),
    });

    const result = await fetchUserLikesFromDB(userId);
    expect(result).toEqual([]);
  });

  it('throws if user does not exist', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    await expect(fetchUserLikesFromDB(userId)).rejects.toThrow();
  });

  it('throws if Firestore throws', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(fetchUserLikesFromDB(userId)).rejects.toThrow();
  });
});

describe('fetchUserDislikesFromDB', () => {
  const userId = 'user-123';

  it('returns dislikes array if present', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ dislikes: ['x', 'y'] }),
    });

    const result = await fetchUserDislikesFromDB(userId);
    expect(result).toEqual(['x', 'y']);
  });

  it('returns empty array if dislikes is missing', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({}),
    });

    const result = await fetchUserDislikesFromDB(userId);
    expect(result).toEqual([]);
  });

  it('throws if user does not exist', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    await expect(fetchUserDislikesFromDB(userId)).rejects.toThrow();
  });

  it('throws if Firestore throws', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(fetchUserDislikesFromDB(userId)).rejects.toThrow();
  });
});

describe('fetchUserChatsFromDB', () => {
  const userId = 'user-123';

  it('returns chats array if present', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ chats: ['chat1', 'chat2'] }),
    });

    const result = await fetchUserChatsFromDB(userId);
    expect(result).toEqual(['chat1', 'chat2']);
  });

  it('returns empty array if chats is missing', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({}),
    });

    const result = await fetchUserChatsFromDB(userId);
    expect(result).toEqual([]);
  });

  it('throws if user does not exist', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });

    await expect(fetchUserChatsFromDB(userId)).rejects.toThrow();
  });

  it('throws if Firestore throws', async () => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (getDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    await expect(fetchUserChatsFromDB(userId)).rejects.toThrow();
  });
});

describe('sendMessage', () => {
  const chatId = 'chat-123';
  const message = {
    id: 'msg-1',
    senderId: 'user1',
    receiverId: 'user2',
    message: 'Hello!',
    timestamp: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
    read: false,
  };

  beforeEach(() => {
    (doc as jest.Mock).mockImplementation((db, collectionName, docId) => `mock-${docId}-ref`);
    (arrayUnion as jest.Mock).mockImplementation((msg) => [msg]);
    (increment as jest.Mock).mockImplementation((val) => val);
  });

  it('returns true when message is successfully added', async () => {
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn(async (docRef) => ({
          exists: () => true,
          data: () => ({ messages: [] }),
        })),
        update: jest.fn(),
      };
      await transactionFn(transaction);

      expect(transaction.update).toHaveBeenCalledWith(
        'mock-chat-123-ref',
        expect.objectContaining({
          messages: [message],
          lastMessage: message,
          'unreadCounts.user2': 1,
        })
      );
    });

    const result = await sendMessage(chatId, message);
    expect(result).toBe(true);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });

  it('returns false if chat does not exist', async () => {
    (runTransaction as jest.Mock).mockImplementation(async (db, transactionFn) => {
      const transaction = {
        get: jest.fn(async (docRef) => ({
          exists: () => false,
        })),
        update: jest.fn(),
      };
      await transactionFn(transaction);
    });

    const result = await sendMessage(chatId, message);
    expect(result).toBe(false);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });

  it('returns false if transaction fails', async () => {
    (runTransaction as jest.Mock).mockImplementation(async () => {
      throw new Error('Transaction failed');
    });

    const result = await sendMessage(chatId, message);
    expect(result).toBe(false);
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
  });
});

describe('addChat', () => {
  const userId1 = 'user1';
  const userId2 = 'user2';
  const chatId = 'mock-chat-id';

  // Mock Firestore and timestamp dependencies for each addChat test
  beforeEach(() => {
    (collection as jest.Mock).mockImplementation((db, col) => `mock-${col}-collection`);
    (doc as jest.Mock).mockImplementation((...args) => {
      if (args.length === 1 && typeof args[0] === 'string' && args[0].includes('collection')) {
        return { id: chatId }; // for new chat doc
      }
      return `mock-${args[2]}-ref`;
    });
    (runTransaction as jest.Mock).mockResolvedValue(undefined);
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ name: 'Test User', photo: 'photo-url' }),
    });
    (Timestamp.fromDate as jest.Mock).mockReturnValue('mock-timestamp');
  });

  it('creates a chat and adds chat to both users', async () => {
    await addChat(userId1, userId2);

    // Check chat doc creation
    expect(runTransaction).toHaveBeenCalledWith(expect.anything(), expect.any(Function));
    
    // Check that doc was called for both users' chat arrays
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId1);
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', userId2);
  });

  it('throws if fetching user info fails', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => false,
    });

    await expect(addChat(userId1, userId2)).rejects.toThrow();
  });

  it('throws if Firestore transaction fails', async () => {
    (runTransaction as jest.Mock).mockRejectedValue(new Error('Transaction failed'));

    await expect(addChat(userId1, userId2)).rejects.toThrow();
  });
});