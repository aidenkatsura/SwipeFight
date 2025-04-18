import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '@/styles/theme';
import { Discipline } from '@/types/fighter';

interface DisciplineFilterProps {
  selectedDiscipline: Discipline | 'All';
  onSelectDiscipline: (discipline: Discipline | 'All') => void;
}

const disciplines: (Discipline | 'All')[] = [
  'All', 
  'Boxing', 
  'BJJ', 
  'Muay Thai', 
  'MMA', 
  'Judo', 
  'Wrestling', 
  'Karate', 
  'Taekwondo'
];

export default function DisciplineFilter({ 
  selectedDiscipline, 
  onSelectDiscipline 
}: DisciplineFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {disciplines.map((discipline) => (
        <TouchableOpacity
          key={discipline}
          style={[
            styles.disciplineButton,
            selectedDiscipline === discipline && styles.selectedDiscipline
          ]}
          onPress={() => onSelectDiscipline(discipline)}
        >
          <Text 
            style={[
              styles.disciplineText,
              selectedDiscipline === discipline && styles.selectedDisciplineText
            ]}
          >
            {discipline}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing[2],
  },
  disciplineButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: 20,
    marginRight: theme.spacing[2],
    backgroundColor: theme.colors.gray[200],
  },
  selectedDiscipline: {
    backgroundColor: theme.colors.primary[500],
  },
  disciplineText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.gray[700],
  },
  selectedDisciplineText: {
    color: theme.colors.white,
  },
});