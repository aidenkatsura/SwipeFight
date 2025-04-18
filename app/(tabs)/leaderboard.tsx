import { StyleSheet, Text, View, SectionList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { mockFighters } from '@/data/mockFighters';
import { Fighter, Discipline } from '@/types/fighter';
import { theme } from '@/styles/theme';
import DisciplineFilter from '@/components/DisciplineFilter';
import { Medal } from 'lucide-react-native';

type LeaderboardSection = {
  title: Discipline;
  data: Fighter[];
};

export default function LeaderboardScreen() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | 'All'>('All');
  
  // Group and sort fighters by discipline and rating
  const groupedFighters = mockFighters.reduce<Record<string, Fighter[]>>((acc, fighter) => {
    if (!acc[fighter.discipline]) {
      acc[fighter.discipline] = [];
    }
    acc[fighter.discipline].push(fighter);
    return acc;
  }, {});
  
  // Sort fighters by rating (descending)
  Object.keys(groupedFighters).forEach(discipline => {
    groupedFighters[discipline].sort((a, b) => b.rating - a.rating);
  });
  
  // Convert to sections format for SectionList
  let sections: LeaderboardSection[] = Object.keys(groupedFighters).map(discipline => ({
    title: discipline as Discipline,
    data: groupedFighters[discipline].slice(0, 5) // Top 5 per discipline
  }));
  
  // Filter sections if a discipline is selected
  if (selectedDiscipline !== 'All') {
    sections = sections.filter(section => section.title === selectedDiscipline);
  }
  
  // Sort sections alphabetically by discipline name
  sections.sort((a, b) => a.title.localeCompare(b.title));
  
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
      <TouchableOpacity style={styles.fighterItem}>
        <Text style={styles.rank}>{index + 1}</Text>
        {medal && <View style={styles.medalContainer}>{medal}</View>}
        <Image source={{ uri: item.photo }} style={styles.fighterImage} />
        <View style={styles.fighterInfo}>
          <Text style={styles.fighterName}>{item.name}</Text>
          <Text style={styles.fighterRank}>{item.rank}</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.record}>{item.wins}W-{item.losses}L-{item.draws}D</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderSectionHeader = ({ section }: { section: LeaderboardSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <DisciplineFilter 
          selectedDiscipline={selectedDiscipline} 
          onSelectDiscipline={setSelectedDiscipline} 
        />
      </View>
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderFighterItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.listContent}
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