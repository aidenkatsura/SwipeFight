import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { theme } from '@/styles/theme';
import { mockChats } from '@/data/mockChats';
import { ChatMessage, Chat } from '@/types/chat';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { Send, Flag } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ScorecardModal from '@/components/ScorecardModal';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [isScorecardVisible, setIsScorecardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const keyboardHeight = useRef(0);

  useEffect(() => {
    // Find the chat with the matching ID
    const foundChat = mockChats.find(chat => chat.id === id);
    if (foundChat) {
      setChat(foundChat);
      // In a real app, we would fetch messages for this chat
      // For now, we'll just use some mock messages
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          senderId: '1',
          receiverId: '2',
          message: 'Hey! Ready for our match?',
          timestamp: new Date(Date.now() - 3600000),
          read: true,
        },
        {
          id: '2',
          senderId: '2',
          receiverId: '1',
          message: 'Absolutely! When works for you?',
          timestamp: new Date(Date.now() - 3500000),
          read: true,
        },
        {
          id: '3',
          senderId: '1',
          receiverId: '2',
          message: 'How about tomorrow at 3 PM?',
          timestamp: new Date(Date.now() - 3400000),
          read: true,
        },
      ];
      setMessages(mockMessages);
    }

    // Add keyboard listeners
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
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [id]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: '1', // Current user's ID
        receiverId: '2', // Other participant's ID
        message: newMessage.trim(),
        timestamp: new Date(),
        read: false,
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSubmitResult = (winnerId: string, videoUri?: string) => {
    // Here you would typically:
    // 1. Upload the video to storage if provided
    // 2. Update the match result in the database
    // 3. Update both users' stats
    console.log('Match result submitted:', { winnerId, videoUri });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isCurrentUser = item.senderId === '1'; // Assuming current user's ID is '1'

    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: theme.spacing[2], justifyContent: isCurrentUser ? 'flex-end' : 'flex-start' }}>
        {!isCurrentUser && (
          <Image
            source={{ uri: otherParticipant.photo }}
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
            {formatDistanceToNow(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (!chat) {
    return null; // Or a loading state
  }

  // Get the other participant (not the current user)
  const otherParticipant = chat.participants[1];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: theme.spacing[3] }}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.gray[900]} />
          </TouchableOpacity>
          <Image
            source={{ uri: otherParticipant.photo }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{otherParticipant.name}</Text>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setIsScorecardVisible(true)}
          >
            <Flag size={24} color={theme.colors.primary[500]} />
            <Text style={styles.reportButtonText}>Report Result</Text>
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
          participants={chat.participants}
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