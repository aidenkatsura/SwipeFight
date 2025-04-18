import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pencil as EditPencil, Settings, Medal, Trophy, LogOut } from 'lucide-react-native';
import { theme } from '@/styles/theme';
import { mockCurrentUser } from '@/data/mockCurrentUser';
import StatCard from '@/components/StatCard';

export default function ProfileScreen() {
  const user = mockCurrentUser;
  
  const stats = [
    {
      id: '1',
      title: 'Wins',
      value: user.wins,
      iconName: 'trophy',
      color: theme.colors.success[500],
    },
    {
      id: '2',
      title: 'Losses',
      value: user.losses,
      iconName: 'x',
      color: theme.colors.error[500],
    },
    {
      id: '3',
      title: 'Draws',
      value: user.draws,
      iconName: 'minus',
      color: theme.colors.warning[500],
    },
    {
      id: '4',
      title: 'Rating',
      value: user.rating,
      iconName: 'star',
      color: theme.colors.gold,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings color={theme.colors.white} size={24} />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editProfileButton}>
              <EditPencil color={theme.colors.white} size={18} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <View style={styles.disciplineBadge}>
            <Text style={styles.disciplineText}>{user.discipline}</Text>
          </View>
          <Text style={styles.rank}>{user.rank}</Text>
          <Text style={styles.location}>{user.location}</Text>
          
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
          {user.achievements && user.achievements.length > 0 ? (
            user.achievements.map((achievement, index) => (
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
          {user.recentMatches && user.recentMatches.length > 0 ? (
            user.recentMatches.map((match, index) => (
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
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut color={theme.colors.gray[600]} size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    height: 120,
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    justifyContent: 'flex-start',
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
    marginTop: -50,
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
    color: theme.colors.gray[800],
  },
  matchDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.gray[600],
  },
  matchResultBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.spacing[1],
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
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing[4],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing[6],
    padding: theme.spacing[3],
  },
  logoutText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[600],
    marginLeft: theme.spacing[2],
  },
});