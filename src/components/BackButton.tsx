import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface BackButtonProps {
  onPress?: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    if (onPress) onPress();
    else navigation.goBack();
  };

  return (
    <TouchableOpacity
      testID="back-button"
      onPress={handlePress}
      activeOpacity={0.8}
      style={{ top: Math.max(insets.top + 10, 20) }}
      className="absolute z-50 left-5 w-11 h-11 bg-white/90 rounded-full items-center justify-center"
    >
      <ChevronLeft size={24} color={COLORS.textDark} />
    </TouchableOpacity>
  );
}
