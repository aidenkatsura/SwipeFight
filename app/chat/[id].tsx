import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/styles/theme';
import { ChatMessage, Chat } from '@/types/chat';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { Send, Flag } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchChatFromDB, fetchUserFromDB, sendMessage } from '@/utils/firebaseUtils';
import { Fighter } from '@/types/fighter';
import { Ionicons } from '@expo/vector-icons';
import { increment, updateDoc, doc, onSnapshot, Timestamp, arrayUnion } from 'firebase/firestore';
import ScorecardModal from '@/components/ScorecardModal';
import { getAuth } from 'firebase/auth';
import { db } from '@/FirebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isScorecardVisible, setIsScorecardVisible] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const COOLDOWN_MINUTES = 2;
  const flatListRef = useRef<FlatList>(null);
  const keyboardHeight = useRef(0);

  type EnrichedChat = {
    chat: Chat;
    otherParticipant: Fighter;
  };
  
  const [chat, setChat] = useState<EnrichedChat | null>(null);
  
  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!id || typeof id !== 'string' || !userId) return;

    const chatRef = doc(db, 'chats', id);

    const unsubscribe = onSnapshot(chatRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const chatData = snapshot.data() as Chat;

      const otherUserId =
        userId === chatData.participants[0].id
          ? chatData.participants[1].id
          : chatData.participants[0].id;

      const otherParticipant = await fetchUserFromDB(otherUserId);

      const enriched: EnrichedChat = {
        chat: chatData,
        otherParticipant,
      };

      setChat(enriched);
      setMessages(chatData.messages); // live update
    });

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        keyboardHeight.current = e.endCoordinates.height;
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        keyboardHeight.current = 0;
      }
    );

    return () => {
      unsubscribe(); // Cleanup Firestore listener
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [id]);

  const handleSend = () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn("User ID is undefined. User might not be logged in.");
      return;
    }
    if (!chat) {
      return null;
    }

    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: userId, // Current user's ID
        receiverId: chat?.otherParticipant.id, // Other participant's ID
        message: newMessage.trim(),
        timestamp: Timestamp.fromDate(new Date()),
        read: false,
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      sendMessage(chat.chat.id, message);
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSubmitResult = async (winnerId: string, videoUri?: string) => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId || !chat) return;

      let videoUrl: string | undefined;

      if (videoUri) {
        videoUrl = await uploadVideo(videoUri, chat.chat.id);
      }

      await addMatchResult(chat.chat.id, winnerId, videoUrl);

      for (const participant of chat.chat.participants) {
        const didWin = participant.id === winnerId;
        await updateUserStats(participant.id, didWin);
      }

      setIsCooldown(true);
      setTimeout(() => { setIsCooldown(false); }, COOLDOWN_MINUTES * 60 * 1000); // Convert minutes to milliseconds
    } catch (error) {
    console.error('Error submitting result:', error);
  }
  };
  
  const uploadVideo = async (uri: string, chatId: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, `fightVideos/${chatId}/${Date.now()}.mp4`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const addMatchResult = async (chatId: string, winnerId: string, videoUrl?: string) => {
    const chatRef = doc(db, 'chats', chatId);
    const result = {
      winnerId,
      videoUrl: videoUrl || null,
      submittedAt: Timestamp.now(),
    };
    await updateDoc(chatRef, {
      results: arrayUnion(result),
    });
  };

  const updateUserStats = async (userId: string, didWin: boolean) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      wins: didWin ? increment(1) : increment(0),
      losses: didWin ? increment(0) : increment(1),
      rating: didWin ? increment(10) : increment(-10),
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const isCurrentUser = item.senderId === userId;
    if (!chat) {
    return null; // Or a loading state
  }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: theme.spacing[2], justifyContent: isCurrentUser ? 'flex-end' : 'flex-start' }}>
        {!isCurrentUser && (
          <Image
            source={{uri: chat.otherParticipant.photo}}
            style={{ width: 28, height: 28, borderRadius: 14, marginRight: theme.spacing[2] }}
          />
        )}
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>
          {formatDistanceToNow(item.timestamp.toDate())}
        </Text>
        </View>
      </View>
    );
  };

  if (!chat) {
    return null; // Or a loading state
  }

  // Get the other participant (not the current user)
  //const otherParticipant = chat.participants[1];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: theme.spacing[3] }}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.gray[900]} />
          </TouchableOpacity>
          <Image
            source={{ uri: chat.otherParticipant.photo }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{chat.otherParticipant.name}</Text>
          <TouchableOpacity
            style={[styles.reportButton,
                    isCooldown && { backgroundColor: theme.colors.gray[300] },
                  ]}
            onPress={() => !isCooldown && setIsScorecardVisible(true)}
            disabled={isCooldown}
          >
            <Flag size={24} color={isCooldown ? theme.colors.gray[500] : theme.colors.primary[500]} />
            <Text style={[
                  styles.reportButtonText,
                  isCooldown && { color: theme.colors.gray[500] }
                ]}
            >
              {isCooldown ? 'Please wait...' : 'Report Result'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.gray[400]}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
            >
              <Send size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <ScorecardModal
          visible={isScorecardVisible}
          onClose={() => setIsScorecardVisible(false)}
          onSubmit={handleSubmitResult}
          participants={chat.chat.participants}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing[3],
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.gray[900],
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing[4],
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: theme.spacing[2],
    padding: theme.spacing[3],
    borderRadius: theme.spacing[3],
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary[500],
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.gray[100],
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: theme.spacing[1],
  },
  currentUserText: {
    color: theme.colors.white,
  },
  otherUserText: {
    color: theme.colors.gray[900],
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.gray[500],
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    marginRight: theme.spacing[2],
    maxHeight: 100,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: theme.colors.primary[500],
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    padding: theme.spacing[2],
    backgroundColor: theme.colors.primary[50],
    borderRadius: 8,
  },
  reportButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.primary[500],
    marginLeft: theme.spacing[1],
  },
});
