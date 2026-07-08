import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import BackButton from '../src/components/BackButton';
import { useNavigation } from '@react-navigation/native';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('BackButton', () => {
  it('renders correctly', async () => {
    await render(<BackButton />);
    expect(screen.getByTestId('back-button')).toBeTruthy();
  });

  it('calls navigation.goBack when no onPress is provided', async () => {
    const goBackMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ goBack: goBackMock });

    await render(<BackButton />);
    const button = screen.getByTestId('back-button');
    
    fireEvent.press(button);
    expect(goBackMock).toHaveBeenCalled();
  });

  it('calls onPress prop if provided instead of goBack', async () => {
    const goBackMock = jest.fn();
    const onPressMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ goBack: goBackMock });

    await render(<BackButton onPress={onPressMock} />);
    const button = screen.getByTestId('back-button');
    
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
    expect(goBackMock).not.toHaveBeenCalled();
  });
});
