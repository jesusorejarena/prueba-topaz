import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../constants/theme';
import ProductCard from '../components/ProductCard';
import { useProducts, SortOption } from '../hooks/useProducts';
import { useCollapsibleHeader } from '../hooks/useCollapsibleHeader';

import ProductsHeader from '../components/ProductsHeader';
import CategoriesModal from '../components/CategoriesModal';
import FiltersModal from '../components/FiltersModal';
import { ProductsLoadingState, ProductsErrorState, ProductsEmptyState } from '../components/FeedbackStates';

export default function ProductsScreen() {
  const { 
    products, 
    categories,
    initialLoad,
    loading,
    isRefreshing,
    isFetchingNextPage,
    hasMore,
    error, 
    refetch,
    fetchNextPage,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    sortBy, setSortBy,
    priceRange, setPriceRange
  } = useProducts();

  const [showFilters, setShowFilters] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const {
    translateY,
    handleScroll,
    headerHeight,
    titleHeight,
    paddingTop,
    setPaddingTop,
  } = useCollapsibleHeader(200);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (initialLoad && loading) {
    return <ProductsLoadingState />;
  }

  if (error) {
    return <ProductsErrorState error={error} onRefetch={refetch} />;
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="flex-1 overflow-hidden">
        <ProductsHeader
          translateY={translateY}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setShowAllCategories={setShowAllCategories}
          onHeaderLayout={(height) => {
            headerHeight.current = height;
            setPaddingTop(height);
          }}
          onTitleLayout={(height) => {
            titleHeight.current = height;
          }}
        />
        
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductCard item={item} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperClassName="justify-between px-5"
          contentContainerStyle={{ paddingTop: paddingTop + 10 }}
          contentContainerClassName="pb-24"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshing={isRefreshing}
          onRefresh={refetch}
          onEndReached={hasMore ? fetchNextPage : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-6 items-center justify-center">
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={<ProductsEmptyState />}
        />
      </View>

      <CategoriesModal
        visible={showAllCategories}
        onClose={() => setShowAllCategories(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <FiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
    </SafeAreaView>
  );
}
