import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/styles/theme';
import { ChatMessage, Chat } from '@/types/chat';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { Send, Flag } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchUserFromDB, sendMessage } from '@/utils/firebaseUtils';
import { Fighter } from '@/types/fighter';
import { Ionicons } from '@expo/vector-icons';
import { increment, updateDoc, doc, onSnapshot, Timestamp, arrayUnion, getDoc } from 'firebase/firestore';
import ScorecardModal from '@/components/ScorecardModal';
import { getAuth } from 'firebase/auth';
import { db } from '@/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACHIEVEMENTS } from '@/types/achievements';
import { useCustomBack } from '@/hooks/useCustomBack';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isScorecardVisible, setIsScorecardVisible] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const COOLDOWN_MINUTES = 2;
  const flatListRef = useRef<FlatList>(null);
  const keyboardHeight = useRef(0);

  type EnrichedChat = {
    chat: Chat;
    otherParticipant: Fighter;
  };

  const [chat, setChat] = useState<EnrichedChat | null>(null);

  const handleBack = useCustomBack(); // Custom back nav hook

  // Redirect to chats list on loading error
  useEffect(() => {
    if (error) {
      router.replace('/(tabs)/chats');
    }
  }, [error, router]);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!id || typeof id !== 'string' || !userId) {
      setError('invalid-params');
      return;
    }

    const chatRef = doc(db, 'chats', id);

    const unsubscribe = onSnapshot(chatRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setError('not-found');
        return;
      }

      try {
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
        setMessages(chatData.messages);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError('fetch-error');
      }
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const checkCooldown = async () => {
      if (!id) return;
      const storedCooldown = await AsyncStorage.getItem(`cooldown_${id}`);
      if (storedCooldown) {
        const cooldownEnd = parseInt(storedCooldown, 10);
        const now = Date.now();
        if (cooldownEnd > now) {
          setIsCooldown(true);
          setTimeout(() => {
            setIsCooldown(false);
            AsyncStorage.removeItem(`cooldown_${id}`);
          }, cooldownEnd - now);
        } else {
          await AsyncStorage.removeItem(`cooldown_${id}`);
          setIsCooldown(false);
        }
      }
    };
    checkCooldown();
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

  const handleSubmitResult = async (winnerId: string) => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId || !chat) return;

      for (const participant of chat.chat.participants) {
        let result = null;
        if (winnerId === 'draw') {
          result = 'draw';
        } else if (participant.id === winnerId) {
          result = 'win';
        } else {
          result = 'loss';
        }

        await addMatchResult(participant.id, chat.chat.id, winnerId, result);
        await updateUserStats(participant.id, result);
      }

      setIsCooldown(true);
      const cooldownEnd = Date.now() + COOLDOWN_MINUTES * 60 * 1000;
      await AsyncStorage.setItem(
        `cooldown_${chat.chat.id}`,
        cooldownEnd.toString()
      );
      setTimeout(() => {
        setIsCooldown(false);
        AsyncStorage.removeItem(`cooldown_${chat.chat.id}`);
      }, COOLDOWN_MINUTES * 60 * 1000);
    } catch (error) {
      console.error('Error submitting result:', error);
    }
  };

  const addMatchResult = async (userId: string, chatId: string, winnerId: string, matchResult: string) => {
    const userRef = doc(db, 'users', userId);
    const chatRef = doc(db, 'chats', chatId);
    const resultForChat = {
      winnerId,
      submittedAt: Timestamp.now(),
    };
    await updateDoc(chatRef, {
      results: arrayUnion(resultForChat),
    });

    const opponent = chat?.chat.participants.find(p => p.id !== userId);
    const resultForUser = {
      opponentPhoto: opponent?.photo || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
      opponentName: opponent?.name || '',
      date: Timestamp.fromDate(new Date()),
      result: matchResult
    }
    await updateDoc(userRef, {
      recentMatches: arrayUnion(resultForUser),
    });
  };

  const updateUserStats = async (userId: string, result: string) => {
    const userRef = doc(db, 'users', userId);

    // Update stats
    const updatedStats: any = {};

    if (result === 'win') {
      updatedStats.wins = increment(1);
      updatedStats.rating = increment(10);
    } else if (result === 'loss') {
      updatedStats.losses = increment(1);
      updatedStats.rating = increment(-10);
    } else if (result === 'draw') {
      updatedStats.draws = increment(1);
    }

    await updateDoc(userRef, updatedStats);

    // Check for achievements
    const updatedSnap = await getDoc(userRef);
    const updatedUser = updatedSnap.data();

    if (!updatedUser) return;

    let newAchievements = [];

    const categories = ['wins', 'losses', 'draws', 'rating'] as const;
    const existingAchievementNames = (updatedUser.achievements || []).map((a: { achievement: string }) => a.achievement);

    for (const category of categories) {
      const currentValue = updatedUser[category];
      const unlocked = ACHIEVEMENTS[category]
        .filter(a => currentValue == a.count && !existingAchievementNames.includes(a.name))
        .map(a => ({
          achievement: a.name,
          date: Timestamp.now()
        }));
      
      newAchievements.push(...unlocked);
    }

    if (newAchievements.length > 0) {
      await updateDoc(userRef, {
        achievements: arrayUnion(...newAchievements)
      });
    }
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

  // Display loading state
  if (!chat || error) {
    return (
      <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </GestureHandlerRootView>
    );
  }

  // Get the other participant (not the current user)
  //const otherParticipant = chat.participants[1];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={{ marginRight: theme.spacing[3] }}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.gray[900]} accessibilityLabel="Go back" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '../other_profile/other_profile', params: { userId: chat.otherParticipant.id } })}
            accessibilityLabel={`View ${chat.otherParticipant.name}'s profile`}
            accessibilityHint="Tap to view fighter's profile"
          >
            <Image
              source={{ uri: chat.otherParticipant.photo }}
              style={styles.profileImage}
              accessibilityLabel={`${chat.otherParticipant.name}'s profile picture`}
            />
          </TouchableOpacity>
          <Text style={styles.userName}>{chat.otherParticipant.name}</Text>
          <TouchableOpacity
            style={[styles.reportButton,
                    isCooldown && { backgroundColor: theme.colors.gray[300] },
                  ]}
            onPress={() => !isCooldown && setIsScorecardVisible(true)}
            disabled={isCooldown}
            accessibilityLabel="Report match result"
            accessibilityHint="Double tap to report the match result"
            accessibilityState={{ disabled: isCooldown }}
          >
            <Flag size={24} color={isCooldown ? theme.colors.gray[500] : theme.colors.primary[500]} accessibilityLabel="Report icon" />
            <Text style={[
                  styles.reportButtonText,
                  isCooldown && { color: theme.colors.gray[500] }
                ]}
            >
              {isCooldown ? 'Result Reported' : 'Report Result'}
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
              accessibilityLabel="Send message"
              accessibilityHint="Tap to send your message"
            >
              <Send size={24} color={theme.colors.white} accessibilityLabel="Send icon" />
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
