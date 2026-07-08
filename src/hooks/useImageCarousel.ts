import { useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export function useImageCarousel(width: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  return {
    activeIndex,
    handleScroll,
  };
}
