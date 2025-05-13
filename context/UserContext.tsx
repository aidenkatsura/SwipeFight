import React, { createContext, useContext, useState, useCallback } from 'react';
import { Fighter } from '@/types/fighter';
import { fetchUserFromDB } from '@/utils/firebaseUtils';
import { auth } from '@/FirebaseConfig';
import { UserProfile } from '@/app/(tabs)/profile';

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  fetchUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  fetchUser: async () => {},
});

// Tracks a user profile, allowing for shared user profile state between components
// (useful for updating user state in profile page after editing)
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Fetch user data from Firestore
  const fetchUser = useCallback(async () => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user found.');
    }

    try {
      const userData = await fetchUserFromDB(auth.currentUser.uid);
      setUser(userData as UserProfile);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data.');
    }
  }, [auth]); // Update on auth change

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);