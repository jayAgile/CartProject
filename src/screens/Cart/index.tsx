import {View, Text, FlatList} from 'react-native';
import React from 'react';
import {useCart} from './controller';
import CartItem from './components/CartItem';
import {styles} from './styles';

export const CartScreen = () => {
  const {
    productsList,
    totalAmount,
    products,
    addQtyInCart,
    removeQtyInCart,
    applyPromoCode,
  } = useCart();

  const renderProductItem = ({item}: {item: ProductItem}) => (
    <CartItem
      productItem={item}
      selectedProductList={productsList}
      handleMinusQty={removeQtyInCart}
      handlePlusQty={addQtyInCart}
      onApplyPress={applyPromoCode}
    />
  );
  return (
    <View style={styles.container}>
      <Text>My Cart</Text>
      <Text>Total Amount To buy: ${totalAmount ?? '0'}</Text>
      <FlatList
        data={products}
        showsVerticalScrollIndicator={false}
        renderItem={renderProductItem}
        keyExtractor={item => item.product_id.toString()}
      />
    </View>
  );
};
