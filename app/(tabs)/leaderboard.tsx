import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { Fighter, Discipline } from '@/types/fighter';
import { theme } from '@/styles/theme';
import DisciplineFilter from '@/components/DisciplineFilter';
import { filterFightersByDiscipline } from '@/utils/filterUtils';
import { Medal } from 'lucide-react-native';
import { fetchUsersFromDB } from '@/utils/firebaseUtils';
import { router } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';

export default function LeaderboardScreen() {
  // All fighters that have not been swiped on
  const [allFighters, setAllFighters] = useState<Fighter[]>([]);

  // Fighters from allFighters that matched the most recent filter.
  // Only updated when a filter is applied - not modified on swipes.
  const [filteredFighters, setFilteredFighters] = useState<Fighter[]>([]);
   const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get all users from db
    const fetchUsers = async () => {
      try {
        setIsLoading(true); // Set loading to true so spinner shows while fetching
  
        const users: Fighter[] = await fetchUsersFromDB();
        setAllFighters(users);
        setFilteredFighters(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Fetch users when the component mounts
    useEffect(() => {
      fetchUsers();
    }, []);  



  const handleFilterChange = (discipline: Discipline | 'All') => {
      if (discipline === 'All') {
        setSelectedDiscipline([]);
        setFilteredFighters(allFighters);
        return;
      }
  
      setSelectedDiscipline(prev => {
        const newDisciplines = prev.includes(discipline)
          ? prev.filter(d => d !== discipline)
          : [...prev, discipline];
        
        const filtered = filterFightersByDiscipline(allFighters, newDisciplines);
        setFilteredFighters(filtered);
        
        return newDisciplines;
      });
    };
  
  // Sort fighters by rating (descending)
  Object.keys(filteredFighters).forEach(discipline => {
    filteredFighters.sort((a, b) => b.rating - a.rating);
  });
  
  const renderFighterItem = ({ item, index }: { item: Fighter; index: number }) => {
    const medal = index < 3 ? (
      <Medal 
        size={24} 
        color={
          index === 0 ? theme.colors.gold :
          index === 1 ? theme.colors.silver :
          theme.colors.bronze
        } 
        strokeWidth={2.5}
      />
    ) : null;
    
    return (
      <TouchableOpacity
        style={styles.fighterItem}
        testID={`fighter-card-${item.id}`}
        onPress={() => router.push({ pathname: '../other_profile/other_profile', params: { userId: item.id } })}
      >
        <Text style={styles.rank}>{index + 1}</Text>
        {medal && <View style={styles.medalContainer}>{medal}</View>}
        <Image source={{ uri: item.photo }} style={styles.fighterImage} />
        <View style={styles.fighterInfo}>
          <Text style={styles.fighterName}>{item.name}</Text>
          <Text style={styles.fighterRank}>{item.discipline}</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.record}>{item.wins}W-{item.losses}L-{item.draws}D</Text>
          <Text style={styles.fighterRank}>{item.rank}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} testID='leaderboard-screen'>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <DisciplineFilter 
          selectedDisciplines={selectedDiscipline}
          onSelectDiscipline={handleFilterChange}
        />
      </View>
      
      <FlatList
        data={filteredFighters}
        keyExtractor={(item) => item.id}
        renderItem={renderFighterItem}
        contentContainerStyle={styles.listContent}
        testID='leaderboard-list'
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[2],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing[2],
  },
  listContent: {
    paddingBottom: theme.spacing[6],
  },
  sectionHeader: {
    backgroundColor: theme.colors.gray[100],
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[300],
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.gray[800],
  },
  fighterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  rank: {
    width: 30,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.gray[700],
  },
  medalContainer: {
    marginRight: theme.spacing[2],
  },
  fighterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing[3],
  },
  fighterInfo: {
    flex: 1,
  },
  fighterName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.gray[900],
  },
  fighterRank: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.gray[600],
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.primary[500],
  },
  record: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.gray[600],
  },
});