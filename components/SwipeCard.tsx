import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Star, Award, Circle } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { Fighter } from '@/types/fighter';

interface SwipeCardProps {
  fighter: Fighter;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeCard({ fighter, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  // Add safety check to prevent accessing properties of undefined fighter
  if (!fighter) {
    return null;
  }

  const { height } = Dimensions.get('window');
  const cardHeight = height * 0.6;

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <Image
        source={{ uri: fighter.photo }}
        style={styles.image}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />

      <View style={styles.infoContainer}>
        <View style={styles.nameAgeContainer}>
          <Text style={styles.name}>{fighter.name}</Text>
          <Text style={styles.age}>{fighter.age}</Text>
        </View>

        <View style={styles.disciplineContainer}>
          <View style={styles.disciplineWrapper}>
            <Text style={styles.discipline}>{fighter.discipline}</Text>
          </View>
          <Text style={styles.rank}>{fighter.rank}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MapPin size={16} color={theme.colors.white} style={styles.icon} />
            <Text style={styles.statText}>{fighter.distance} miles away</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Star size={16} color={theme.colors.gold} style={styles.icon} />
            <Text style={styles.statText}>{fighter.rating} rating</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Award size={16} color={theme.colors.white} style={styles.icon} />
            <Text style={styles.statText}>{fighter.wins}-{fighter.losses}-{fighter.draws}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={onSwipeLeft}
          >
            <Circle size={32} color={theme.colors.error[500]} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.challengeButton]}
            onPress={onSwipeRight}
          >
            <Circle size={32} color={theme.colors.success[500]} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.gray[200],
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing[4],
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: theme.spacing[1],
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: theme.colors.white,
    marginRight: theme.spacing[2],
  },
  age: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: theme.colors.white,
  },
  disciplineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  disciplineWrapper: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: 16,
    marginRight: theme.spacing[2],
  },
  discipline: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.white,
  },
  rank: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: theme.spacing[3],
    borderRadius: 12,
    marginBottom: theme.spacing[4],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: theme.spacing[1],
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.white,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: theme.spacing[2],
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  skipButton: {
    backgroundColor: theme.colors.white,
  },
  challengeButton: {
    backgroundColor: theme.colors.white,
  },
});