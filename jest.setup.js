/* eslint-env jest */
import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('lucide-react-native', () => {
  const MockIcon = () => null;
  return {
    ChevronLeft: MockIcon,
    Heart: MockIcon,
    Search: MockIcon,
    X: MockIcon,
    SlidersHorizontal: MockIcon,
    ArrowDownAZ: MockIcon,
    ArrowDown01: MockIcon,
    ArrowUp10: MockIcon,
    Star: MockIcon,
    ShoppingBag: MockIcon,
    AlertCircle: MockIcon,
    ChevronRight: MockIcon,
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
  };
});
