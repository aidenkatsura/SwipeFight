import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc, runTransaction, arrayUnion, Timestamp, increment} from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { Fighter } from '@/types/fighter';
import { Chat, ChatMessage} from '@/types/chat';

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
}

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

    return true; // Change successful
  } catch (error) {
    console.error('Error changing document ID:', error);
    return false; // Return false if the transaction fails
  }
};


/**
 * Adds a Like to the target user's Likes array
 * 
 * @param {string} userId1 - The current document ID of the user.
 * @param {string} userId1 - The user id of the user whose been Liked with.
 * @returns {Promise<boolean>} Resolves to true if successful
 * @throws Throws an error if an unexpected failure occurs.
 */
export async function addLikeToUser(userId1: string, userId2: string) {
  return addToUserArray(userId1, userId2, "likes");
};

/**
 * Adds a dislike to the user's dislike array
 * 
 * 
 * @param {string} targetUserId - The current document ID of the user.
 * @param {string} dislikedUserId - The user id of the user whose been matched with.
 * @returns {Promise<boolean>} Resolves to true if successful
 * @throws Throws an error if an unexpected failure occurs.
 */
 export async function addDislikeToUser(userId1: string, userId2: string){
  return addToUserArray(userId1, userId2, "dislikes");
};

/**
 * Fetch a specific chat from the Firestore database.
 *  
 * @param {string} targetChatId - the target id of the Chat
 * 
 * @returns {Promise<Chat>} A promise that resolves to an array of Fighter objects.
 * @throws Throws an error if fetching users fails.
 */
export const fetchChatFromDB = async (targetChatId: string): Promise<Chat> => {
  try {
    const docRef = doc(db, 'chats', targetChatId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Chat;
    } else {
      throw new Error('No such document!');
    }
  } catch (error) {
    console.error('Error fetching chat from Firestore:', error);
    throw new Error('No such document!');
  }
};


/**
 * Fetch a specific user from the Firestore database.
 *  
 * @param {string} targetUserId - the target id of the user
 * 
 * @returns {Promise<Fighter>} A promise that resolves to an array of Fighter objects.
 * @throws Throws an error if fetching users fails.
 */
export const fetchUserFromDB = async (targetUserId: string): Promise<Fighter> => {
  try {
    const docRef = doc(db, 'users', targetUserId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Fighter;
    } else {
      throw new Error('No such user!');
    }
  } catch (error) {
    console.error('Error fetching user from Firestore:', error);
    throw new Error('No such user!');
  }
};

/**
 * Fetch the 'likes' array from a specific user document.
 * 
 * @param {string} targetUserId - The document ID of the user.
 * @returns {Promise<string[]>} A promise that resolves to an array of chat IDs.
 * @throws Throws an error if fetching the user fails.
 */
export const fetchUserLikesFromDB = async (targetUserId: string): Promise<string[]> => {
  return fetchUserArray(targetUserId, "likes");
};


/**
 * Fetch the 'dislikes' array from a specific user document.
 * 
 * @param {string} targetUserId - The document ID of the user.
 * @returns {Promise<string[]>} A promise that resolves to an array of chat IDs.
 * @throws Throws an error if fetching the user fails.
 */
export const fetchUserDislikesFromDB = async (targetUserId: string): Promise<string[]> => {
  return fetchUserArray(targetUserId, "dislikes");
};


/**
 * Fetch the 'chats' array from a specific user document.
 * 
 * @param {string} targetUserId - The document ID of the user.
 * @returns {Promise<string[]>} A promise that resolves to an array of chat IDs.
 * @throws Throws an error if fetching the user fails.
 */
export const fetchUserChatsFromDB = async (targetUserId: string): Promise<string[]> => {
  return fetchUserArray(targetUserId, "chats");
};


/**
 * Adds a user ID to a specific array field in another user's document.
 *
 * @param {string} targetUserId - The user document to update.
 * @param {string} userIdToAdd - The user ID to add to the array.
 * @param {string} arrayField - The name of the array field to update (e.g., 'matches', 'likes').
 * @returns {Promise<boolean>} Resolves to true if successful, false otherwise.
 */
async function addToUserArray(targetUserId: string, userIdToAdd: string, arrayField: string): 
                                                                          Promise<boolean> {
  try {
    const userRef = doc(db, 'users', targetUserId);

    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        throw new Error(`User with ID ${targetUserId} does not exist.`);
      }

      transaction.update(userRef, {
        [arrayField]: arrayUnion(userIdToAdd),
      });
    });

    return true;
  } catch (error) {
    console.error(`Error adding ${userIdToAdd} to ${arrayField} for user ${targetUserId}:`, error);
    return false;
  }
};

/**
 * Fetch the chosen array from a specific user document.
 * 
 * @param {string} targetUserId - The document ID of the user.
 * @param {string} targetArray - The name of the array field to fetch.
 * @returns {Promise<string[]>} A promise that resolves to the desired array
 * @throws Throws an error if fetching the user fails.
 */
const fetchUserArray = async (targetUserId: string, targetArray: string): Promise<string[]> => {
  try {
    const userDocRef = doc(db, 'users', targetUserId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error(`User with ID ${targetUserId} does not exist.`);
    }

    const userData = userDocSnap.data();
    const arrayData = userData[targetArray];

    return Array.isArray(arrayData) ? arrayData : [];
  } catch (error) {
    console.error(`Error fetching user ${targetUserId}'s ${targetArray} array from Firestore:`, error);
    throw new Error('Failed to fetch user array from Firestore.');
  }
};



/**
 * Adds a chat message to a chat in the database
 *
 * @param {string} chatId - The target chat.
 * @param {ChatMessage} message - The chat message that will be added to the chat.
 * @returns {Promise<boolean>} Resolves to true if successful, false otherwise.
 */
export async function sendMessage(chatId: string, message: ChatMessage): 
                                                                          Promise<boolean> {
  try {
    const chatRef = doc(db, 'chats', chatId);

    await runTransaction(db, async (transaction) => {
      const chatSnap = await transaction.get(chatRef);

      if (!chatSnap.exists()) {
        throw new Error(`Chat with ID ${chatId} does not exist.`);
      }

      const chatData = chatSnap.data();
      const receiverId = message.receiverId;

      transaction.update(chatRef, {
        ["messages"]: arrayUnion(message), ["lastMessage"]: message, [`unreadCounts.${receiverId}`]: increment(1),
      });
      
    });

    return true;
  } catch (error) {
    console.error(`Error adding ${message} to chat ${chatId}:`, error);
    return false;
  }
};

/**
 * Fetch the chosen string field from a specific user document.
 * 
 * @param {string} targetUserId - The document ID of the user.
 * @param {string} targetField - The name of the string field to fetch.
 * @returns {Promise<string>} A promise that resolves to the desired string
 * @throws Throws an error if fetching the user fails or the field is not a string.
 */
const fetchUserString = async (targetUserId: string, targetField: string): Promise<string> => {
  try {
    const userDocRef = doc(db, 'users', targetUserId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error(`User with ID ${targetUserId} does not exist.`);
    }

    const userData = userDocSnap.data();
    const stringData = userData[targetField];

    if (typeof stringData !== 'string') {
      throw new Error(`Field "${targetField}" is not a string.`);
    }

    return stringData;
  } catch (error) {
    console.error(`Error fetching user ${targetUserId}'s ${targetField} string from Firestore:`, error);
    throw new Error('Failed to fetch user string from Firestore.');
  }
};



  /**
 * creates a chat between two users
 * adds it a chat into the chat collection
 * adds the chat id to both user's chat array
 * 
 * 
 * @param {string} userId1 - user 1's id
 * @param {string} userId2 - user 2's id
 * @returns {Promise<boolean>} Resolves to true if the document ID was successfully changed, 
 *                             or false if the old ID does not exist or the new ID already exists.
 * @throws Throws an error if an unexpected failure occurs.
 */
export async function addChat(userId1: string, userId2: string) {
  // Create a reference to a new document in the 'chats' collection
  const chatDocRef = doc(collection(db, 'chats'));
  const chatId = chatDocRef.id;

  const user1Name = await fetchUserString(userId1, "name");
  const user1Photo = await fetchUserString(userId1, "photo");
  const user2Name = await fetchUserString(userId2, "name");
  const user2Photo = await fetchUserString(userId2, "photo");

  const chat: Chat = {
    id: chatId,
    participants: [
      {id: userId1, name: user1Name, photo: user1Photo}, 
      {id: userId2, name: user2Name, photo: user2Photo}
    ],
    messages: [],
    unreadCounts: {
      [userId1]: 0,
      [userId2]: 0,
    },
    lastMessage: {
      id: "",
      senderId: "",
      receiverId: "",
      message: "",
      read: false,
      timestamp: Timestamp.fromDate(new Date()),
    }
  };

  await runTransaction(db, async (transaction) => {
    // Create the new chat document
    transaction.set(chatDocRef, chat);
  });
  addToUserArray(userId1, chatId, "chats");
  addToUserArray(userId2, chatId, "chats");
};
