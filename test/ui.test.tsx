import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import ScorecardModal from '../components/ScorecardModal';
import ProfileScreen from '../app/(tabs)/profile';
import { UserContext } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { SwipeCard } from '../components/SwipeCard';
import { Fighter } from '@/types/fighter';

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()), // Mock signOut to resolve successfully
}));

jest.mock('../FirebaseConfig', () => ({
  auth: {
    signOut: jest.fn(() => Promise.resolve()), // Mock auth.signOut to resolve successfully
  },
}));

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