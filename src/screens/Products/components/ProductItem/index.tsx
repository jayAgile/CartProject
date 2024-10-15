import React from 'react';
import {Button, Text, View} from 'react-native';
import {styles} from './styles';

interface ProductItemProps {
  productItem: ProductItem;
  selectedProductList: ProductItem[];
  onAddToCartPress: (productItem: ProductItem) => void;
}
const ProductItem = (props: ProductItemProps) => {
  const {productItem, selectedProductList, onAddToCartPress} = props;
  const isSelected =
    selectedProductList?.find(
      obj => obj?.product_id === productItem?.product_id,
    ) !== undefined;

  return (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{productItem.name}</Text>
      <Text style={styles.productDescription}>{productItem.description}</Text>
      <Text style={styles.productPrice}>${productItem.price.toFixed(2)}</Text>
      {isSelected ? (
        <Text>Item Added To cart</Text>
      ) : (
        <Button
          title="Add to cart"
          onPress={onAddToCartPress.bind(null, productItem)}
        />
      )}
    </View>
  );
};

export default ProductItem;
