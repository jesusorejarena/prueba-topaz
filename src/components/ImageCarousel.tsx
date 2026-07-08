import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { useImageCarousel } from '../hooks/useImageCarousel';

interface ImageCarouselProps {
  images: string[];
  width: number;
  insetsTop: number;
}

export default function ImageCarousel({ images, width, insetsTop }: ImageCarouselProps) {
  const { activeIndex, handleScroll } = useImageCarousel(width);

  return (
    <View
      className="bg-gray-50/80 rounded-b-[40px] overflow-hidden h-[400px]"
      style={{ paddingTop: insetsTop }}
    >
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{ width }}
            className="h-full justify-center items-center p-6"
          >
            <Image
              source={{ uri: item }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        )}
      />
      {/* Pagination Indicators */}
      {images.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
          {images.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-indigo-600'
                  : 'w-2 bg-black/20'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
