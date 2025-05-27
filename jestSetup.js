// Mock AsyncStorage to prevent errors when using it in tests
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-modules-core to handle native module dependencies
jest.mock('expo-modules-core', () => ({
  requireNativeModule: jest.fn(), // Prevents errors when native modules are required
  EventEmitter: jest.fn(), // Mocks EventEmitter used in some Expo modules
}));

// Mock expo-router to handle navigation-related functionality
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  },
}));

// Mock expo-image-picker to prevent errors when accessing the device's media library or camera
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ cancelled: false, uri: 'mock-uri' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ cancelled: false, uri: 'mock-uri' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
}));

// Mock expo-status-bar to prevent rendering issues in tests
jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(() => null),
}));

// Mock firebase/auth to handle Firebase authentication-related functionality
jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getReactNativePersistence: jest.fn(), // Mock getReactNativePersistence to prevent native module errors
}));