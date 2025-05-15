import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Swiper from 'react-native-deck-swiper';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SwipeCard } from '@/components/SwipeCard';
import { theme } from '@/styles/theme';
import DisciplineFilter from '@/components/DisciplineFilter';
import { Fighter, Discipline } from '@/types/fighter';
import { addChat, addLikeToUser, addDislikeToUser, fetchUsersFromDB } from '@/utils/firebaseUtils';
import { filterFightersByDiscipline, filterFightersByLikes } from '@/utils/filterUtils';
import { getAuth } from 'firebase/auth';
import { updateUserWithRetry } from '@/utils/firebaseUtils';


export default function FightScreen() {
  // All fighters that have not been swiped on
  const [allFighters, setAllFighters] = useState<Fighter[]>([]);

  // Fighters from allFighters that matched the most recent filter.
  // Only updated when a filter is applied - not modified on swipes.
  const [filteredFighters, setFilteredFighters] = useState<Fighter[]>([]);

  const [selectedDisciplines, setSelectedDisciplines] = useState<Discipline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const swiperRef = useRef<Swiper<Fighter>>(null);

  // Get all users from db
  const fetchUsers = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn("User ID is undefined. User might not be logged in.");
      return;
    }
    try {
      setIsLoading(true); // Set loading to true so spinner shows while fetching

      const users: Fighter[] = await fetchUsersFromDB();
      const likeFilteredFighters = await filterFightersByLikes(users, userId);
      setAllFighters(likeFilteredFighters);
      setFilteredFighters(likeFilteredFighters);
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

  const handleSwipeLeft = async (index: number) => {
    triggerHapticFeedback('light');
    if (index >= 0 && index < filteredFighters.length) {
      try {
        await updateUserWithRetry(getAuth().currentUser?.uid || '', {
          dislikes: [filteredFighters[index].id]
        });
      } catch (error) {
        console.error('Error updating dislikes:', error);
      }
    }
  };

  const handleSwipeRight = async (index: number) => {
    triggerHapticFeedback('medium');
    if (index >= 0 && index < filteredFighters.length) {
      try {
        await updateUserWithRetry(getAuth().currentUser?.uid || '', {
          likes: [filteredFighters[index].id]
        });
        console.log('Challenged fighter:', filteredFighters[index].name);
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    }
  };

  const handleSwipe = (index: number) => {
    removeFighterFromAll(index);
  }

  // Removes the fighter at filteredFighters[index] from allFighters (matches on fighter id)
  const removeFighterFromAll = (index: number) => {
    setAllFighters(allFighters.filter((fighter) => fighter.id != filteredFighters[index].id))
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
    if (discipline === 'All') {
      setSelectedDisciplines([]);
      setFilteredFighters(allFighters);
      swiperRef.current?.jumpToCardIndex(0);
      return;
    }

    setSelectedDisciplines(prev => {
      const newDisciplines = prev.includes(discipline)
        ? prev.filter(d => d !== discipline)
        : [...prev, discipline];
      
      const filtered = filterFightersByDiscipline(allFighters, newDisciplines);
      setFilteredFighters(filtered);
      swiperRef.current?.jumpToCardIndex(0);
      
      return newDisciplines;
    });
  };

  const handlePressSwipeLeft = () => {
    swiperRef.current?.swipeLeft();
  };

  const handlePressSwipeRight = () => {
    swiperRef.current?.swipeRight();
  };


  const like = (likedUser: Fighter) => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn("User ID is undefined. User might not be logged in.");
      return;
    }
    //add like to current user
    addLikeToUser(userId, likedUser.id);
    // add chat if other user liked current user
    if (likedUser.likes.includes(userId)) {
      addChat(userId, likedUser.id);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Fighters</Text>
        <DisciplineFilter
          selectedDisciplines={selectedDisciplines}
          onSelectDiscipline={handleFilterChange}
        />
      </View>

      <View style={styles.swiperContainer}>
        {isLoading ? ( // Loading spinner while fetching users
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={100} color={theme.colors.primary[500]} />
          </View>
        ) : filteredFighters.length > 0 ? (
          <Swiper
            ref={swiperRef}
            cards={filteredFighters}
            renderCard={(fighter) => fighter ? (
              <SwipeCard
                fighter={fighter}
                onSwipeLeft={handlePressSwipeLeft}
                onSwipeRight={handlePressSwipeRight}
              />
            ) : null}
            onSwipedRight={handleSwipeRight}
            onSwipedLeft={handleSwipeLeft}
            onSwiped={handleSwipe}
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
            <Text style={styles.emptyStateText}>No fighters found in selected disciplines</Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => setSelectedDisciplines([])}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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