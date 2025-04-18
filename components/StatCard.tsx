import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/styles/theme';
import { Trophy, X, Minus, Star } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: number;
  iconName: string;
  color: string;
}

export default function StatCard({ title, value, iconName, color }: StatCardProps) {
  // Render the appropriate icon based on the iconName prop
  const renderIcon = () => {
    switch (iconName) {
      case 'trophy':
        return <Trophy size={24} color={color} />;
      case 'x':
        return <X size={24} color={color} />;
      case 'minus':
        return <Minus size={24} color={color} />;
      case 'star':
        return <Star size={24} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '22%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing[2],
    padding: theme.spacing[2],
    alignItems: 'center',
    marginHorizontal: '1.5%',
    shadowColor: theme.colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: theme.spacing[1],
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: theme.colors.gray[900],
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
});