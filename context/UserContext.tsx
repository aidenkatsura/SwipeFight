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

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  fetchUser: async () => {},
});

/**
 * Provides shared user profile state across components.
 * Useful for updating the user profile after editing on the profile page.
 *
 * @param children - The child components that will have access to the user context.
 * @returns A context provider for user-related state and actions.
 */
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