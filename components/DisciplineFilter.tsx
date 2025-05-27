import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '@/styles/theme';
import { Discipline } from '@/types/fighter';

interface DisciplineFilterProps {
  selectedDisciplines: Discipline[];
  onSelectDiscipline: (discipline: Discipline | 'All') => void;
}

const disciplines: (Discipline | 'All')[] = [
  'All',
  'Aikido',
  'BJJ',
  'Boxing',
  'Judo',
  'Karate',
  'Kendo',
  'Kickboxing',
  'Kung Fu',
  'Krav Maga',
  'Taekwondo',
  'MMA',
  'Muay Thai',
  'Wrestling'
];

export default function DisciplineFilter({
  selectedDisciplines = [],
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
            (discipline === 'All' ? selectedDisciplines.length === 0 : selectedDisciplines.includes(discipline)) && styles.selectedDiscipline
          ]}
          onPress={() => onSelectDiscipline(discipline)}
          accessibilityLabel={`Filter by ${discipline}`}
          accessibilityState={{ selected: discipline === 'All' ? selectedDisciplines.length === 0 : selectedDisciplines.includes(discipline) }}
        >
          <Text
            style={[
              styles.disciplineText,
              (discipline === 'All' ? selectedDisciplines.length === 0 : selectedDisciplines.includes(discipline)) && styles.selectedDisciplineText
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