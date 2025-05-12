import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { Fighter } from '@/types/fighter';

/**
 * Fetch all users from the Firestore database.
 * 
 * @returns {Promise<Fighter[]>} A promise that resolves to an array of Fighter objects.
 * @throws Throws an error if fetching users fails.
 */
export const fetchUsersFromDB = async (): Promise<Fighter[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map((doc) => doc.data() as Fighter);
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
    throw new Error('Failed to fetch users from Firestore.');
  }
};

/**
 * Add a new fighter to the Firestore database.
 * 
 * The document ID will be the fighter's ID. A fighter will only be added if there is no
 * fighter with the same ID in the database.
 * 
 * @param {Fighter} fighter - The fighter object to add to the database.
 * @returns {Promise<boolean>} Resolves to true if the fighter was successfully added, 
 *                             or false if the fighter already exists.
 * @throws Throws an error if an unexpected failure occurs.
 */
export const addNewUserToDB = async (fighter: Fighter): Promise<boolean> => {
  try {
    const fighterDocRef = doc(db, 'users', fighter.id);

    // Ensure atomicity with a transaction
    const result: boolean = await runTransaction(db, async (transaction) => {
      const docSnapshot = await transaction.get(fighterDocRef);

      // Check if the document already exists
      if (docSnapshot.exists()) {
        console.error(`Fighter with ID ${fighter.id} already exists.`);
        return false; // Fighter already exists - don't override
      }

      // Add the new fighter
      transaction.set(fighterDocRef, fighter);
      return true; // Add successful
    });

    return result; // Return the result of the transaction
  } catch (error) {
    console.error('Error adding fighter to Firestore:', error);
    throw new Error('Unexpected error adding fighter to Firestore.');
  }
};

/**
 * Change the document ID of an existing user in the Firestore database.
 * 
 * **Note:** Intended for development/DB testing purposes. Change Doc IDs with caution.
 * 
 * @param {string} oldDocId - The current document ID of the user.
 * @param {string} newDocId - The new document ID to assign to the user.
 * @returns {Promise<boolean>} Resolves to true if the document ID was successfully changed, 
 *                             or false if the old ID does not exist or the new ID already exists.
 * @throws Throws an error if an unexpected failure occurs.
 */
export const changeUserDocId = async (oldDocId: string, newDocId: string): Promise<boolean> => {
  try {
    await runTransaction(db, async (transaction) => { // Ensure atomicity
      const oldDocRef = doc(db, 'users', oldDocId);
      const newDocRef = doc(db, 'users', newDocId);

      // Check if the old document exists
      const oldDocSnapshot = await transaction.get(oldDocRef);
      if (!oldDocSnapshot.exists()) {
        throw new Error(`Document with ID ${oldDocId} not found.`);
      }

      // Check if the new document ID already exists
      const newDocSnapshot = await transaction.get(newDocRef);
      if (newDocSnapshot.exists()) {
        throw new Error(`Document with ID ${newDocId} already exists.`);
      }

      // Copy data to the new document and delete the old one
      const data = oldDocSnapshot.data();
      transaction.set(newDocRef, data);
      transaction.delete(oldDocRef);
    });

    console.log(`Document ID changed from ${oldDocId} to ${newDocId}`);
    return true; // Change successful
  } catch (error) {
    console.error('Error changing document ID:', error);
    return false; // Return false if the transaction fails
  }
};

/**
 * Update a user's data in the Firestore database.
 * 
 * @param {string} userId - The ID of the user to update (document ID).
 * @param {Partial<Fighter>} updatedData - The data to update. Only the provided fields will be updated.
 * @returns {Promise<boolean>} Resolves to true if the update was successful, or false if the user does not exist.
 * @throws Throws an error if an unexpected failure occurs.
 */
export const updateUserInDB = async (userId: string, updatedData: Partial<Fighter>): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);

    // Ensure the document exists before updating
    const docSnapshot = await getDoc(userDocRef);
    if (!docSnapshot.exists()) {
      console.error(`User with ID ${userId} does not exist.`);
      return false; // User does not exist
    }

    // Update the user's data
    await setDoc(userDocRef, updatedData, { merge: true }); // Merge updates with existing data
    console.log(`User with ID ${userId} successfully updated.`);
    return true; // Update successful
  } catch (error) {
    console.error('Error updating user in Firestore:', error);
    throw new Error('Unexpected error updating user in Firestore.');
  }
};