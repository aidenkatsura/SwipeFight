import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState, useRef } from 'react';
import Swiper from 'react-native-deck-swiper';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SwipeCard } from '@/components/SwipeCard';
import { mockFighters } from '@/data/mockFighters';
import { theme } from '@/styles/theme';
import DisciplineFilter from '@/components/DisciplineFilter';
import { Fighter, Discipline } from '@/types/fighter';

export default function FightScreen() {
  const [fighters, setFighters] = useState(mockFighters);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | 'All'>('All');
  const swiperRef = useRef<Swiper<Fighter>>(null);

  const handleSwipeRight = (index: number) => {
    triggerHapticFeedback('medium');
    // Check if index is valid to prevent accessing undefined fighter
    if (index >= 0 && index < fighters.length) {
      console.log('Challenged fighter:', fighters[index].name);
    }
    // In production, would send challenge request to API
  };

  const handleSwipeLeft = () => {
    triggerHapticFeedback('light');
    // Skipped, nothing to do here
  };

  const triggerHapticFeedback = (intensity: 'light' | 'medium' | 'heavy') => {
    if (Platform.OS !== 'web') {
      switch (intensity) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    }
  };

  const handleFilterChange = (discipline: Discipline | 'All') => {
    setSelectedDiscipline(discipline);
    // In production, would fetch fighters by discipline from API
/*
Should this be fighters, not mockFighters so we don't load all fighters again
*/
    if (discipline === 'All') {
      setFighters(mockFighters);
    } else {
/*
Should this also be fighters?
*/
      setFighters(mockFighters.filter(fighter => fighter.discipline === discipline));
    }
  };

  const handlePressSwipeLeft = () => {
    swiperRef.current?.swipeLeft();
  };

  const handlePressSwipeRight = () => {
    swiperRef.current?.swipeRight();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Fighters</Text>
        <DisciplineFilter
          selectedDiscipline={selectedDiscipline}
          onSelectDiscipline={handleFilterChange}
        />
      </View>

      <View style={styles.swiperContainer}>
        {fighters.length > 0 ? (
          <Swiper
            ref={swiperRef}
            cards={fighters}
            renderCard={(fighter) => fighter ? (
              <SwipeCard
                fighter={fighter}
                onSwipeLeft={handlePressSwipeLeft}
                onSwipeRight={handlePressSwipeRight}
              />
            ) : null}
            onSwipedRight={handleSwipeRight}
            onSwipedLeft={handleSwipeLeft}
            backgroundColor={theme.colors.gray[100]}
            stackSize={3}
            stackSeparation={15}
            animateOverlayLabelsOpacity
            animateCardOpacity
            disableTopSwipe
            disableBottomSwipe
            overlayLabels={{
              left: {
                title: 'SKIP',
                style: {
                  label: styles.overlayLabelSkip,
                  wrapper: styles.overlayWrapper
                }
              },
              right: {
                title: 'CHALLENGE',
                style: {
                  label: styles.overlayLabelChallenge,
                  wrapper: styles.overlayWrapper
                }
              }
            }}
            cardIndex={0}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No fighters found in this discipline</Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => handleFilterChange('All')}
            >
              <Text style={styles.emptyStateButtonText}>Show All Fighters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[100],
  },
  header: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: theme.colors.gray[900],
    marginBottom: theme.spacing[2],
  },
  swiperContainer: {
    flex: 1,
    paddingTop: 0,
  },
  overlayWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    paddingTop: 30,
  },
  overlayLabelSkip: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: theme.colors.error[500],
    borderWidth: 3,
    borderColor: theme.colors.error[500],
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  overlayLabelChallenge: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: theme.colors.success[500],
    borderWidth: 3,
    borderColor: theme.colors.success[500],
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: theme.colors.gray[600],
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  emptyStateButton: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.spacing[2],
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.white,
    fontSize: 16,
  },
});