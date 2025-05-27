import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { router } from 'expo-router';
import { Chat } from '@/types/chat';
import { theme } from '@/styles/theme';
import { formatDistanceToNow } from '@/utils/dateUtils';
import ChatBubble from '@/components/ChatBubble';
import { fetchChatFromDB, fetchUserFromDB, fetchUserChatsFromDB } from '@/utils/firebaseUtils';
import { Fighter } from '@/types/fighter';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from 'expo-router';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';

export default function ChatsScreen() {
  const [loading, setLoading] = useState(true);

  type EnrichedChat = {chat: Chat, otherParticipant: Fighter};
  const [chats, setChats] = useState<EnrichedChat[]>([]);
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  useFocusEffect(
    useCallback(() => {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.warn("User ID is undefined. User might not be logged in.");
        return;
      }
      let unsubscribeFunctions: (() => void)[] = [];

          const subscribeToChats = async () => {
            try {
              const chatIds = await fetchUserChatsFromDB(userId);

              const unsubscribeList = await Promise.all(chatIds.map(async (id: string) => {
                const chatDocRef = doc(db, 'chats', id);

                return onSnapshot(chatDocRef, async (snapshot) => {
                  if (!snapshot.exists()) return;

                  const chatData = snapshot.data() as Chat;

                  const otherUserId = userId === chatData.participants[0].id
                    ? chatData.participants[1].id
                    : chatData.participants[0].id;

                  const otherParticipant = await fetchUserFromDB(otherUserId);

                  setChats(prevChats => {
                    const existingIndex = prevChats.findIndex(c => c.chat.id === chatData.id);

                    const newEnrichedChat = { chat: chatData, otherParticipant };

                    if (existingIndex === -1) {
                      return [...prevChats, newEnrichedChat];
                    } else {
                      const updatedChats = [...prevChats];
                      updatedChats[existingIndex] = newEnrichedChat;
                      return updatedChats;
                    }
                  });
                });
              }));

              unsubscribeFunctions = unsubscribeList;
            } catch (error) {
              console.error('Failed to subscribe to chats:', error);
            } finally {
              setLoading(false);
            }
          };

          subscribeToChats();

          return () => {
            unsubscribeFunctions.forEach(unsub => unsub());
          };
        }, [])
      );
  

    const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      // Sort by unread count first
      const aUnread = a.chat.unreadCounts?.[currentUserId] || 0;
      const bUnread = b.chat.unreadCounts?.[currentUserId] || 0;
      if (aUnread !== bUnread) {
        return bUnread - aUnread;
      }

      // Then sort by last message timestamp
      const aTimestamp = a.chat.lastMessage?.timestamp?.toDate?.();
      const bTimestamp = b.chat.lastMessage?.timestamp?.toDate?.();

      if (aTimestamp && bTimestamp) {
        return bTimestamp.getTime() - aTimestamp.getTime();
      } else if (aTimestamp) {
        return -1;
      } else if (bTimestamp) {
        return 1;
      } else {
        return 0;
      }
    });
  }, [chats, currentUserId]);
  

  const handleChatPress = async (chatId: string) => {
    if (!currentUserId) return;

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.chat.id === chatId
          ? {
              ...chat,
              chat: {
                ...chat.chat,
                unreadCounts: {
                  ...chat.chat.unreadCounts,
                  [currentUserId]: 0
                }
              }
            }
          : chat
      )
    );

    await updateDoc(doc(db, 'chats', chatId), {
      [`unreadCounts.${currentUserId}`]: 0,
    });

    router.push(`/chat/${chatId}`);
  };

  const renderChatItem = ({ item }: { item: EnrichedChat }) => {
    // Get the other participant (not the current user)
    //const otherParticipant = item.participants[1]; // Assuming current user is always at index 0

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item.chat.id)}
      >
        <Image
          source={{ uri: item.otherParticipant.photo}}
          style={styles.profileImage}
        />

        {item.chat.unreadCounts?.[currentUserId] > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.chat.unreadCounts[currentUserId]}</Text>
          </View>
        )}

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName}>{item.otherParticipant.name}</Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(item.chat.lastMessage.timestamp.toDate())}
            </Text>
          </View>

          <Text
            style={[
              styles.lastMessage,
              item.chat.unreadCounts?.[currentUserId] > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.chat.lastMessage.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>

      {sortedChats.length > 0 ? (
        <FlatList
          data={sortedChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.chat.id}
          contentContainerStyle={styles.chatsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <ChatBubble />
          <Text style={styles.emptyStateTitle}>No matches yet</Text>
          <Text style={styles.emptyStateText}>
            Start challenging fighters to get matches and chat with them
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: theme.colors.gray[900],
  },
  chatsList: {
    paddingHorizontal: theme.spacing[4],
  },
  chatItem: {
    flexDirection: 'row',
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    position: 'relative',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing[3],
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.gray[900],
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.gray[500],
  },
  lastMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[600],
  },
  unreadMessage: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.gray[900],
  },
  unreadBadge: {
    position: 'absolute',
    top: 15,
    left: 50,
    backgroundColor: theme.colors.primary[500],
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  unreadText: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: theme.colors.gray[800],
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.gray[600],
    textAlign: 'center',
    maxWidth: 250,
  },
});