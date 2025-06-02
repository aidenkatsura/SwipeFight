import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import ScorecardModal from '../components/ScorecardModal';
import ProfileScreen from '../app/(tabs)/profile';
import { UserContext } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

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
});