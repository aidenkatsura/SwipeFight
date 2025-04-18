import { StyleSheet, View } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { theme } from '@/styles/theme';

export default function ChatBubble() {
  return (
    <View style={styles.container}>
      <MessageSquare size={40} color={theme.colors.primary[400]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
});