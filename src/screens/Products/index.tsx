import {View, Text, Button, FlatList} from 'react-native';
import React from 'react';
import {useProducts} from './controller';
import {styles} from './styles';
import ProductItem from './components/ProductItem';

export const ProductsScreen = () => {
  const {
    loading,
    error,
    products,
    selectedProductList,
    productsInCart,
    onAddToCartHandler,
    addProduct,
    deleteProduct,
    handleRefresh,
    navigateToMyCart,
  } = useProducts();

  const renderProductItem = ({item}: {item: ProductItem}) => (
    <ProductItem
      productItem={item}
      selectedProductList={selectedProductList}
      onAddToCartPress={onAddToCartHandler}
    />
  );
  const renderEmptyComponent = () => <Text>No products available.</Text>;

  return (
    <View style={styles.container}>
      <Button title="Add Products" onPress={addProduct} />
      <Button title="Remove Products" onPress={deleteProduct} />
      <Button title={`My Cart ${productsInCart}`} onPress={navigateToMyCart} />
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={handleRefresh} />
        </View>
      ) : (
        <FlatList
          data={products}
          showsVerticalScrollIndicator={false}
          renderItem={renderProductItem}
          keyExtractor={item => item.product_id.toString()}
          onRefresh={handleRefresh}
          refreshing={loading}
          contentContainerStyle={
            products.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
};
