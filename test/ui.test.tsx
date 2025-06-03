import { render, fireEvent, act, waitFor, within } from '@testing-library/react-native';
import ScorecardModal from '../components/ScorecardModal';
import ProfileScreen from '../app/(tabs)/profile';
import LeaderboardScreen from '../app/(tabs)/leaderboard';
import { UserContext } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { SwipeCard } from '../components/SwipeCard';
import { Fighter } from '@/types/fighter';
import EditProfileScreen from '../app/profile-editor/profile-editor';
import { updateUserInDB } from '@/utils/firebaseUtils';

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()), // Mock signOut to resolve successfully
}));

jest.mock('../FirebaseConfig', () => ({
  auth: {
    signOut: jest.fn(() => Promise.resolve()), // Mock auth.signOut to resolve successfully
  },
}));

// Mock firebaseUtils used by screens and components (so we don't make real Firebase calls)
jest.mock('@/utils/firebaseUtils', () => ({
  // Used by LeaderboardScreen
  fetchUsersFromDB: jest.fn(() =>
    Promise.resolve([
      {
        id: '1',
        name: 'Alice',
        photo: 'alice.jpg',
        discipline: 'Boxing',
        rank: 'Pro',
        rating: 1800,
        wins: 12,
        losses: 1,
        draws: 0,
      },
      {
        id: '2',
        name: 'Bob',
        photo: 'bob.jpg',
        discipline: 'Muay Thai',
        rank: 'Amateur',
        rating: 1500,
        wins: 8,
        losses: 3,
        draws: 2,
      },
    ])
  ),
  // Used by ProfileEditorScreen
  updateUserInDB: jest.fn(() => Promise.resolve(true)),
}));

// Mock FirebaseConfig (auth)
jest.mock('@/FirebaseConfig', () => ({
  auth: {
    currentUser: { uid: '1' },
  },
}));

// Mock useCustomBack to just be a jest.fn()
jest.mock('@/hooks/useCustomBack', () => ({
  useCustomBack: () => jest.fn(),
}));

// Mock LocationSelector to be a simple input for testing
jest.mock('@/components/LocationSelector', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    LocationSelector: ({ onSelect, initialLocation }: any) => {
      // Ensure initialLocation is properly handled
      const initialValue = initialLocation?.name || '';
      
      return (
        <TextInput
          testID="location-selector-input"
          value={initialValue}
          onChangeText={(text: string) => 
            onSelect({ 
              name: text, 
              lat: initialLocation?.lat || 0, 
              lng: initialLocation?.lng || 0 
            })
          }
        />
      );
    },
  };
});

// Mock expo-router's router and hook
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock the SelectList component so it can be used in tests
jest.mock('react-native-dropdown-select-list', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    SelectList: ({
      setSelected,
      data,
      defaultOption,
    }: {
      setSelected: (value: any) => void;
      data: Array<{ value: any; label: string }>;
      defaultOption?: { value: any; label: string };
    }) => {
      const handleSelect = (value: any) => setSelected(value);
      return (
        <View>
          <Text>{defaultOption?.value || ''}</Text>
          {data.map((item) => (
            <TouchableOpacity 
              key={item.value} 
              onPress={() => handleSelect(item.value)}
              testID={`select-option-${item.value}`}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
  };
});

describe('ScorecardModal', () => {
  const participants = [
    { id: '1', name: 'Bob', photo: 'bob.jpg' },
    { id: '2', name: 'Alice', photo: 'alice.jpg' },
  ];

  test('handles winner selection and submit', () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();

    const { getByTestId } = render(
      <ScorecardModal
        visible={true}
        onClose={onClose}
        onSubmit={onSubmit}
        participants={participants}
      />
    );

    // Simulate selecting a winner
    fireEvent(getByTestId('result-submitter'), 'valueChange', '1');

    // Simulate pressing the submit button
    fireEvent.press(getByTestId('result-submit-button'));

    expect(onSubmit).toHaveBeenCalledWith('1');
    expect(onClose).toHaveBeenCalled();
  });

  test('does not call onSubmit/onClose if submit pressed with no selection', () => {
    const onClose = jest.fn();
    const onSubmit = jest.fn();

    const { getByTestId } = render(
      <ScorecardModal
        visible={true}
        onClose={onClose}
        onSubmit={onSubmit}
        participants={participants}
      />
    );

    // Try pressing submit with no selection
    fireEvent.press(getByTestId('result-submit-button'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('ProfileScreen', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    age: 30,
    photo: 'https://example.com/johndoe.jpg',
    discipline: 'Boxing',
    rank: 'Pro',
    location: 'New York',
    rating: 1500,
    wins: 10,
    losses: 2,
    draws: 1,
  };

  let setUser: jest.Mock;
  let fetchUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock calls and instances
    setUser = jest.fn();
    fetchUser = jest.fn(() => Promise.resolve()); // Mock fetchUser to resolve successfully
  });

  test('renders user information', async () => {
    const { getByText } = render(
      <UserContext.Provider value={{ user: mockUser, setUser, fetchUser }}>
        <ProfileScreen />
      </UserContext.Provider>
    );

    // Wait for the user information to appear
    await waitFor(() => expect(getByText(/John Doe/)).toBeTruthy(), { timeout: 10000 });

    // Check if user information is displayed
    expect(getByText(/Boxing/)).toBeTruthy();
    expect(getByText(/Pro/)).toBeTruthy();
    expect(getByText(/New York/)).toBeTruthy();
  });

  test('handles logout', async () => {
    const { getByTestId } = render(
      <UserContext.Provider value={{ user: mockUser, setUser, fetchUser }}>
        <ProfileScreen />
      </UserContext.Provider>
    );

    // Wait for the logout button to appear
    await waitFor(() => expect(getByTestId('logout-button')).toBeTruthy(), { timeout: 10000 });

    // Simulate logout button press
    await act(async () => {
      fireEvent.press(getByTestId('logout-button'));
    });

    // Check that signOut was called
    expect(signOut).toHaveBeenCalled();

    // Check that router.replace was called with the login route
    expect(router.replace).toHaveBeenCalledWith('/(auth)/login');
    expect(router.replace).toHaveBeenCalledTimes(1);
  });

  test('navigates to edit profile screen when edit button pressed', async () => {
    const { getByTestId } = render(
      <UserContext.Provider value={{ user: mockUser, setUser, fetchUser }}>
        <ProfileScreen />
      </UserContext.Provider>
    );

    // Wait for the edit button to appear
    await waitFor(() => expect(getByTestId('edit-profile-button')).toBeTruthy(), { timeout: 10000 });

    // Simulate pressing the edit button
    fireEvent.press(getByTestId('edit-profile-button'));

    // Check that router.push was called with the edit profile route
    expect(router.push).toHaveBeenCalledWith('/profile-editor/profile-editor');
    expect(router.push).toHaveBeenCalledTimes(1);
  });
});

describe('SwipeCard', () => {
  const fighter: Fighter = {
    id: '1',
    name: 'Jane Doe',
    age: 28,
    photo: 'https://example.com/jane.jpg',
    discipline: 'Muay Thai',
    rank: 'Amateur',
    location: 'Seattle',
    rating: 1450,
    wins: 5,
    losses: 2,
    draws: 1,
    coordinates: { // Mock GeoPoint
      latitude: 0,
      longitude: 0,
      isEqual: () => true,
      toJSON: () => ({ latitude: 0, longitude: 0 }),
    },
    likes: [],
    dislikes: [],
    achievements: [],
    recentMatches: [],
    chats: [],
  };

  it('renders fighter info', () => {
    const { getByText } = render(<SwipeCard fighter={fighter} />);
    expect(getByText('Jane Doe')).toBeTruthy();
    expect(getByText('28')).toBeTruthy();
    expect(getByText('Muay Thai')).toBeTruthy();
    expect(getByText('Amateur')).toBeTruthy();
    expect(getByText('Seattle')).toBeTruthy();
    expect(getByText('1450 rating')).toBeTruthy();
    expect(getByText('5-2-1')).toBeTruthy();
  });

  it('calls onSwipeLeft when skip button pressed', () => {
    const onSwipeLeft = jest.fn();
    const { getAllByLabelText } = render(
      <SwipeCard fighter={fighter} onSwipeLeft={onSwipeLeft} />
    );
    // The skip button has accessibilityLabel="Skip fighter"
    fireEvent.press(getAllByLabelText('Skip fighter')[0]);
    expect(onSwipeLeft).toHaveBeenCalled();
  });

  it('calls onSwipeRight when challenge button pressed', () => {
    const onSwipeRight = jest.fn();
    const { getAllByLabelText } = render(
      <SwipeCard fighter={fighter} onSwipeRight={onSwipeRight} />
    );
    // The challenge button has accessibilityLabel="Challenge fighter"
    fireEvent.press(getAllByLabelText('Challenge fighter')[0]);
    expect(onSwipeRight).toHaveBeenCalled();
  });
});

describe('LeaderboardScreen', () => {
  it('renders each fighter\'s details', async () => {
    const { getByTestId } = render(<LeaderboardScreen />);

    // Wait for fighters to be rendered
    await waitFor(() => {
      const aliceCard = getByTestId('fighter-card-1');
      const bobCard = getByTestId('fighter-card-2');

      // Check Alice's details
      expect(within(aliceCard).getByText('Alice')).toBeTruthy();
      expect(within(aliceCard).getByText('Boxing')).toBeTruthy();
      expect(within(aliceCard).getByText('1800')).toBeTruthy();
      expect(within(aliceCard).getByText('12W-1L-0D')).toBeTruthy();
      expect(within(aliceCard).getByText('Pro')).toBeTruthy();

      // Check Bob's details
      expect(within(bobCard).getByText('Bob')).toBeTruthy();
      expect(within(bobCard).getByText('Muay Thai')).toBeTruthy();
      expect(within(bobCard).getByText('1500')).toBeTruthy();
      expect(within(bobCard).getByText('8W-3L-2D')).toBeTruthy();
      expect(within(bobCard).getByText('Amateur')).toBeTruthy();
    });
  });

  it('navigates to other profile when fighter is pressed', async () => {
    const { getByText } = render(<LeaderboardScreen />);

    // Wait for fighters to be rendered
    await waitFor(() => {
      fireEvent.press(getByText('Alice'));
      expect(router.push).toHaveBeenCalledWith({ pathname: '../other_profile/other_profile', params: { userId: '1' } });
    });
  });

  it('renders fighters in the correct order', async () => {
    const { getByTestId } = render(<LeaderboardScreen />);

    // Wait for fighters to be rendered
    await waitFor(() => {
      const fightersList = getByTestId('leaderboard-list');

      // Get all fighter cards in the list
      const fighterCards = within(fightersList).getAllByTestId(/fighter-card-/);

      // Assert order by checking the text within each card
      expect(within(fighterCards[0]).getByText('Alice')).toBeTruthy();
      expect(within(fighterCards[1]).getByText('Bob')).toBeTruthy();
    });
  });

  it('renders the correct fighters when a filter is applied', async () => {
    const { getByTestId, queryByText, queryByTestId } = render(<LeaderboardScreen />);

    // Wait for fighters to be rendered
    await waitFor(() => {
      const fightersList = getByTestId('leaderboard-list');
      expect(fightersList).toBeTruthy();
    });

    // Simulate applying the "Boxing" filter
    const leaderboardScreen = getByTestId('leaderboard-screen');
    const boxingFilterButton = within(leaderboardScreen).getByTestId('filter-Boxing');
    fireEvent.press(boxingFilterButton);

    // Wait for the filtered results
    await waitFor(() => {
      // Check that only fighters matching the filter are displayed
      expect(getByTestId('fighter-card-1')).toBeTruthy(); 
      expect(queryByText('Alice')).toBeTruthy(); // Alice should be displayed

      expect(queryByTestId('fighter-card-2')).toBeNull();
      expect(queryByText('Bob')).toBeNull(); // Bob should not be displayed
    });
  });

  it('renders correct fighters after filtering and unfiltering', async () => {
    const { getByTestId, queryByText, queryByTestId } = render(<LeaderboardScreen />);

    // Wait for fighters to be rendered
    await waitFor(() => {
      const fightersList = getByTestId('leaderboard-list');
      expect(fightersList).toBeTruthy();
    });

    // Simulate applying the "Boxing" filter
    const boxingFilterButton = getByTestId('filter-Boxing');
    fireEvent.press(boxingFilterButton);

    // Wait for the filtered results
    await waitFor(() => {
      // Check that only fighters matching the filter are displayed
      expect(getByTestId('fighter-card-1')).toBeTruthy(); // Alice should be displayed
      expect(queryByText('Alice')).toBeTruthy();

      expect(queryByTestId('fighter-card-2')).toBeNull(); // Bob should not be displayed
      expect(queryByText('Bob')).toBeNull();
    });

    // Simulate unfiltering by selecting the "All" filter
    const allFilterButton = getByTestId('filter-All');
    fireEvent.press(allFilterButton);

    // Wait for the unfiltered results
    await waitFor(() => {
      // Check that all fighters are displayed again
      expect(getByTestId('fighter-card-1')).toBeTruthy(); // Alice should be displayed
      expect(queryByText('Alice')).toBeTruthy();

      expect(getByTestId('fighter-card-2')).toBeTruthy(); // Bob should be displayed
      expect(queryByText('Bob')).toBeTruthy();
    });
  });

  it('renders no fighters when no matches exist for the filter', async () => {
    const { getByTestId, queryByTestId } = render(<LeaderboardScreen />);

    // Wait for fighters to be rendered
    await waitFor(() => {
      const fightersList = getByTestId('leaderboard-list');
      expect(fightersList).toBeTruthy();
    });

    // Simulate applying a filter with no matches
    const mmaFilterButton = getByTestId('filter-MMA');
    fireEvent.press(mmaFilterButton);

    // Wait for the filtered results
    await waitFor(() => {
      // Check that no fighters are displayed
      expect(queryByTestId('fighter-card-1')).toBeNull();
      expect(queryByTestId('fighter-card-2')).toBeNull();
    });
  });
});

describe('EditProfileScreen', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    age:30,
    photo: 'https://example.com/johndoe.jpg',
    discipline: 'Boxing',
    rank: 'Pro',
    location: 'New York',
    rating: 1500,
    wins: 10,
    losses: 2,
    draws: 1,
    coordinates: { latitude: 0, longitude: 0, isEqual: () => true, toJSON: () => ({ latitude: 0, longitude: 0 }) },
  };

  let setUser: jest.Mock;
  let fetchUser: jest.Mock;

  beforeEach(() => {
    setUser = jest.fn();
    fetchUser = jest.fn(() => Promise.resolve());
    global.alert = jest.fn();
    jest.clearAllMocks();
  });

  it('renders the profile editor with user info', async () => {
    const { getByDisplayValue, getByText, getByTestId } = render(
      <UserContext.Provider value={{ 
        user: {
          ...mockUser,
          location: {
            name: 'New York',
            lat: 0,
            lng: 0
          }
        }, 
        setUser, 
        fetchUser 
      }}>
        <EditProfileScreen />
      </UserContext.Provider>
    );

    await act(async () => {
      await waitFor(() => {
        // Check text inputs
        expect(getByDisplayValue('John Doe')).toBeTruthy();
        expect(getByDisplayValue('30')).toBeTruthy();
        
        // Check location through testID and props
        const locationInput = getByTestId('location-selector-input');
        expect(locationInput.props.value).toBe('New York');
        
        // Check if discipline and rank are displayed
        expect(getByText('Boxing')).toBeTruthy();
        expect(getByText('Pro')).toBeTruthy();
      });
    });
  });

  it('allows editing and submitting profile changes', async () => {
    const { getByDisplayValue, getByText, getByTestId } = render(
      <UserContext.Provider value={{ user: mockUser, setUser, fetchUser }}>
        <EditProfileScreen />
      </UserContext.Provider>
    );

    await act(async () => {
      fireEvent.changeText(getByDisplayValue('John Doe'), 'Jane Smith');
      fireEvent.changeText(getByDisplayValue('30'), '25');
      fireEvent.press(getByTestId('select-option-MMA'));
      fireEvent.press(getByTestId('select-option-Beginner'));
      fireEvent.changeText(getByTestId('location-selector-input'), 'Los Angeles');
    });

    // Save changes
    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane Smith',
          age: 25,
          discipline: 'MMA',
          rank: 'Beginner',
          location: 'Los Angeles'
        })
      );
      expect(updateUserInDB).toHaveBeenCalledWith('1', expect.objectContaining({
        name: 'Jane Smith',
        age: 25,
        discipline: 'MMA',
        rank: 'Beginner',
        location: 'Los Angeles'
      }));
    });
  });

  it('shows alert if required fields are empty and does not update DB', async () => {
    const { getByDisplayValue, getByText } = render(
      <UserContext.Provider value={{ user: mockUser, setUser, fetchUser }}>
        <EditProfileScreen />
      </UserContext.Provider>
    );

    // Clear name
    await act(async () => {
      fireEvent.changeText(getByDisplayValue('John Doe'), '');
    });

    // Try to save
    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    // Check results
    expect(global.alert).toHaveBeenCalled(); // Give some alert to user about missing fields
    expect(updateUserInDB).not.toHaveBeenCalled();
    expect(setUser).not.toHaveBeenCalled();
  });
});