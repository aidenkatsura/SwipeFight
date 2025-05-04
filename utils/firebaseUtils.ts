import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { Fighter } from '@/types/fighter';

// Fetch all users from the Firestore db
export const fetchUsersFromDB = async (): Promise<Fighter[]> => {
  try {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map((doc) => doc.data() as Fighter);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Add a new fighter to the Firestore db. Document ID is set to the fighter's ID.
// Returns true if successfully added, false otherwise (including if the fighter already exists).
export const addNewFighterToDB = async (fighter: Fighter): Promise<boolean> => {
  try {
    if (!fighter.id) {
      console.error('Fighter needs ID to be added to db.');
      return false; // Return false if the fighter doesn't have an ID
    }

    const fighterDocRef = doc(db, 'users', fighter.id); // Use fighter.id as the document ID

    // Check if a document with the same ID already exists
    const docSnapshot = await getDoc(fighterDocRef);
    if (docSnapshot.exists()) {
      console.error(`A fighter with ID ${fighter.id} already exists!`);
      return false; // Return false if the document already exists
    }

    // Add the new fighter to Firestore
    await setDoc(fighterDocRef, fighter);
    console.log(`New fighter added with ID: ${fighter.id}`);
    return true; // Return true if the fighter was successfully added
  } catch (error) {
    console.error('Error adding new fighter with ID:', error);
    return false; // Return false if an error occurred
  }
};

// Change the document ID of an existing user in the db
export const changeUserDocId = async (oldDocId: string, newDocId: string): Promise<void> => {
  try {
    const oldDocRef = doc(db, 'users', oldDocId);
    const docSnapshot = await getDoc(oldDocRef);

    if (!docSnapshot.exists()) {
      console.error('Document not found!');
      return;
    }

    const data = docSnapshot.data();
    const newDocRef = doc(db, 'users', newDocId);
    await setDoc(newDocRef, data);
    await deleteDoc(oldDocRef);

    console.log(`Document ID changed from ${oldDocId} to ${newDocId}`);
  } catch (error) {
    console.error('Error changing document ID:', error);
    throw error;
  }
};