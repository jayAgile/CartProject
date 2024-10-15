import {Button, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';

interface ProductItemProps {
  productItem: ProductItem;
  selectedProductList: ProductItem[];
  onApplyPress: (product: ProductItem, promoCode: string) => void;
  handleMinusQty: (product: ProductItem) => void;
  handlePlusQty: (product: ProductItem) => void;
}
const CartItem = (props: ProductItemProps) => {
  const {
    productItem,
    selectedProductList,
    onApplyPress,
    handlePlusQty,
    handleMinusQty,
  } = props;
  const [promoCode, onPromoCodeChange] = useState<string>('');

  const selectedProduct = selectedProductList?.find(
    obj => obj.product_id === productItem.product_id,
  );
  return (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{productItem.name}</Text>
      <Text style={styles.productDescription}>{productItem.description}</Text>
      <Text style={styles.productPrice}>${productItem.price.toFixed(2)}</Text>

      <View style={styles.qtyContainer}>
        <TouchableOpacity
          onPress={handleMinusQty?.bind(null, productItem)}
          style={styles.qtyButton}>
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyNumber}>{selectedProduct?.quantity}</Text>
        <TouchableOpacity
          onPress={handlePlusQty?.bind(null, productItem)}
          style={styles.qtyButton}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.checkboxContainer}>
        <TextInput
          value={promoCode}
          placeholder="Apply Promo code"
          onChangeText={text => onPromoCodeChange(text)}
        />
        <Button
          title="Apply"
          onPress={onApplyPress?.bind(null, productItem, promoCode)}
        />
      </View>
    </View>
  );
};

export default CartItem;
