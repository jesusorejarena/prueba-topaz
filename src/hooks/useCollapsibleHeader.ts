import { useRef, useState } from 'react';
import { Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export function useCollapsibleHeader(initialPaddingTop = 200) {
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const headerHeight = useRef(initialPaddingTop);
  const titleHeight = useRef(60);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paddingTop, setPaddingTop] = useState(initialPaddingTop);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    
    if (currentY < 0) return;

    if (currentY <= 50) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }).start();
      lastScrollY.current = currentY;
      return;
    }

    const diff = currentY - lastScrollY.current;
    
    if (Math.abs(diff) > 10) {
      if (diff > 0) {
        Animated.timing(translateY, {
          toValue: -headerHeight.current,
          duration: 80,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: -titleHeight.current,
          duration: 80,
          useNativeDriver: true,
        }).start();
      }
      lastScrollY.current = currentY;
    }

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      if (lastScrollY.current <= titleHeight.current) {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: -titleHeight.current,
          duration: 80,
          useNativeDriver: true,
        }).start();
      }
    }, 200);
  };

  return {
    translateY,
    handleScroll,
    headerHeight,
    titleHeight,
    paddingTop,
    setPaddingTop,
  };
}
