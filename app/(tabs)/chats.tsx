import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import { router } from 'expo-router';
import { mockChats } from '@/data/mockChats';
import { Chat } from '@/types/chat';
import { theme } from '@/styles/theme';
import { formatDistanceToNow } from '@/utils/dateUtils';
import ChatBubble from '@/components/ChatBubble';

export default function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Simulate API fetch
    setChats(mockChats);
  }, []);

  // Sort chats by unread status and timestamp
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      // First sort by unread status
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

      // Then sort by timestamp (most recent first)
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    });
  }, [chats]);

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    // Get the other participant (not the current user)
    const otherParticipant = item.participants[1]; // Assuming current user is always at index 0

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item.id)}
      >
        <Image
          source={{ uri: otherParticipant.photo }}
          style={styles.profileImage}
        />

        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName}>{otherParticipant.name}</Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(item.lastMessage.timestamp)}
            </Text>
          </View>

          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.message}
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
          keyExtractor={(item) => item.id}
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