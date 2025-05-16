import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pencil as EditPencil, Settings, Medal, LogOut } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { Fighter } from '@/types/fighter';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../FirebaseConfig';
import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { useUser } from '@/context/UserContext';
import { fetchUserFromDB } from '@/utils/firebaseUtils';

export type UserProfile = Fighter & {
  achievements?: string[];
  recentMatches?: {
    opponentName: string;
    opponentPhoto: string;
    date: string;
    result: 'win' | 'loss' | 'draw';
  }[];
};

export default function ProfileScreen() {
  const { user, fetchUser } = useUser();
  const { userId: viewedUserIdParam } = useLocalSearchParams();
  const [viewedUser, setViewedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isOwnProfile = !viewedUserIdParam || viewedUserIdParam === user?.id;

  useEffect(() => {
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isOwnProfile) {
        const fetched = await fetchUserFromDB(viewedUserIdParam as string);
        setViewedUser(fetched);
        setLoading(false);
      } else {
        await fetchUser(); // this will cause context.user to update
        // Do not setViewedUser(user) here — let next effect handle it
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setLoading(false);
    }
  };

  loadProfile();
}, [viewedUserIdParam]);

// Second effect: wait for updated user from context
useEffect(() => {
  if (isOwnProfile && user) {
    setViewedUser(user);
    setLoading(false);
  }
}, [user, isOwnProfile]);

  const handleEditProfilePress = () => {
    router.push('/profile-editor/profile-editor');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size={50} color={theme.colors.primary[500]} />
      </SafeAreaView>
    );
  }

  if (error || !viewedUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error loading profile: {error}</Text>
      </SafeAreaView>
    );
  }

  const stats = [
    {
      id: '1',
      title: 'Wins',
      value: viewedUser.wins || 0,
      iconName: 'trophy',
      color: theme.colors.success[500],
    },
    {
      id: '2',
      title: 'Losses',
      value: viewedUser.losses || 0,
      iconName: 'x',
      color: theme.colors.error[500],
    },
    {
      id: '3',
      title: 'Draws',
      value: viewedUser.draws || 0,
      iconName: 'minus',
      color: theme.colors.warning[500],
    },
    {
      id: '4',
      title: 'Rating',
      value: viewedUser.rating || 0,
      iconName: 'star',
      color: theme.colors.gold,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.settingsContainer}>
        {isOwnProfile && (
          <TouchableOpacity style={styles.settingsButton}>
            <Settings color={theme.colors.gray[700]} size={24} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: viewedUser.photo }} style={styles.profileImage} />
            {isOwnProfile && (
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={handleEditProfilePress}
              >
                <EditPencil color={theme.colors.white} size={18} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.name}>{viewedUser.name}, {viewedUser.age}</Text>
          <View style={styles.disciplineBadge}>
            <Text style={styles.disciplineText}>{viewedUser.discipline}</Text>
          </View>
          <Text style={styles.rank}>{viewedUser.rank}</Text>
          <Text style={styles.location}>{viewedUser.location}</Text>

          <View style={styles.statsGrid}>
            {stats.map(stat => (
              <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                iconName={stat.iconName}
                color={stat.color}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {viewedUser.achievements && viewedUser.achievements.length > 0 ? (
            viewedUser.achievements.map((achievement, index) => (
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
          {viewedUser.recentMatches && viewedUser.recentMatches.length > 0 ? (
            viewedUser.recentMatches.map((match, index) => (
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

      {isOwnProfile && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut color={theme.colors.gray[600]} size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  settingsContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
    alignItems: 'flex-end',
  },
  settingsButton: {
    padding: theme.spacing[2],
  },
  scrollContent: {
    paddingBottom: theme.spacing[8],
  },
  profileHeader: {
    alignItems: 'center',
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
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[4],
    padding: theme.spacing[3],
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.gray[600],
    marginLeft: theme.spacing[2],
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.error[500],
    textAlign: 'center',
    paddingVertical: theme.spacing[4],
  },
});