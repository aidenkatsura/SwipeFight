import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Medal } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { Fighter } from '@/types/fighter';
import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { fetchUserFromDB } from '@/utils/firebaseUtils';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams(); // Get userId from URL params
  const [profileUser, setProfileUser] = useState<Fighter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches user data once on first mount
  useEffect(() => { 
    const loadProfile = async () => {
      try {
        const fetchedUser = await fetchUserFromDB(userId);
        setProfileUser(fetchedUser);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]); // re-run when userId changes (e.g., different profile clicked)

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size={50} color={theme.colors.primary[500]} />
      </SafeAreaView>
    );
  }

  const stats = [
    {
      id: '1',
      title: 'Wins',
      value: profileUser?.wins || 0,
      iconName: 'trophy',
      color: theme.colors.success[500],
    },
    {
      id: '2',
      title: 'Losses',
      value: profileUser?.losses || 0,
      iconName: 'x',
      color: theme.colors.error[500],
    },
    {
      id: '3',
      title: 'Draws',
      value: profileUser?.draws || 0,
      iconName: 'minus',
      color: theme.colors.warning[500],
    },
    {
      id: '4',
      title: 'Rating',
      value: profileUser?.rating || 0,
      iconName: 'star',
      color: theme.colors.gold,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {error || !profileUser ? (
        // Loading error or no user data
        <Text style={styles.errorText}>Error loading profile: {error}</Text>
      ) : (
        // Main profile content
        <>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: theme.spacing[3] }}>
              <Ionicons name="arrow-back" size={28} color={theme.colors.gray[900]} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <Image source={{ uri: profileUser.photo }} style={styles.profileImage} />
              </View>

              <Text style={styles.name}>{profileUser.name}, {profileUser.age}</Text>
              <View style={styles.disciplineBadge}>
                <Text style={styles.disciplineText}>{profileUser.discipline}</Text>
              </View>
              <Text style={styles.rank}>{profileUser.rank}</Text>
              <Text style={styles.location}>{profileUser.location}</Text>

              <View style={styles.statsGrid}>
                {stats.map(stat => (
                  <StatCard
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    iconName={stat.iconName}
                    color={stat.color} />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
              {profileUser.achievements && profileUser.achievements.length > 0 ? (
                profileUser.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <Medal color={theme.colors.primary[500]} size={20} />
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No achievements yet</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Matches</Text>
              {profileUser.recentMatches && profileUser.recentMatches.length > 0 ? (
                profileUser.recentMatches.map((match, index) => (
                  <View key={index} style={styles.matchItem}>
                    <Image source={{ uri: match.opponentPhoto }} style={styles.matchOpponentImage} />
                    <View style={styles.matchDetails}>
                      <Text style={styles.matchOpponent}>{match.opponentName}</Text>
                      <Text style={styles.matchDate}>{match.date}</Text>
                    </View>
                    <View style={[
                      styles.matchResultBadge,
                      match.result === 'win' ? styles.winBadge :
                        match.result === 'loss' ? styles.lossBadge :
                          styles.drawBadge
                    ]}>
                      <Text style={styles.matchResultText}>
                        {match.result.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No recent matches</Text>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingBottom: theme.spacing[8],
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: theme.colors.white,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.gray[900],
    marginTop: theme.spacing[2],
  },
  disciplineBadge: {
    backgroundColor: theme.colors.primary[100],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: 15,
    marginTop: theme.spacing[1],
  },
  disciplineText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.primary[600],
  },
  rank: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.gray[700],
    marginTop: theme.spacing[1],
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[600],
    marginTop: theme.spacing[1],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  section: {
    paddingHorizontal: theme.spacing[4],
    marginTop: theme.spacing[4],
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.gray[800],
    marginBottom: theme.spacing[2],
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing[3],
    borderRadius: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  achievementText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[800],
    marginLeft: theme.spacing[2],
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing[3],
    borderRadius: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  matchOpponentImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  matchDetails: {
    flex: 1,
    marginLeft: theme.spacing[2],
  },
  matchOpponent: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.gray[900],
  },
  matchDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.gray[600],
    marginTop: 2,
  },
  matchResultBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: 12,
  },
  winBadge: {
    backgroundColor: theme.colors.success[100],
  },
  lossBadge: {
    backgroundColor: theme.colors.error[100],
  },
  drawBadge: {
    backgroundColor: theme.colors.warning[100],
  },
  matchResultText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[600],
    textAlign: 'center',
    paddingVertical: theme.spacing[4],
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.error[500],
    textAlign: 'center',
    paddingVertical: theme.spacing[4],
  },
});