import React, {useRef} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import {IcDelete, IcEdit} from '../../../../constants';

interface ProductItemProps {
  productItem: ProductItem;
  selectedProductList: ProductItem[];
  onAddToCartPress: (productItem: ProductItem) => void;
  onDeletePress: (productItem: ProductItem) => void;
  onEditPress: (productItem: ProductItem) => void;
}
const ProductItem = (props: ProductItemProps) => {
  const {
    productItem,
    selectedProductList,
    onAddToCartPress,
    onDeletePress,
    onEditPress,
  } = props;

  const swipeRef = useRef<SwipeableMethods>(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const isSelected =
    selectedProductList?.find(
      obj => obj?.product_id === productItem?.product_id,
    ) !== undefined;
  const onDeletePressHandler = () => {
    swipeRef.current?.close();
    onDeletePress(productItem);
  };
  const onEditPressHandler = () => {
    swipeRef.current?.close();
    onEditPress(productItem);
  };

  const renderRightActionsHandler = () => (
    <View style={styles.btnContainer}>
      <TouchableOpacity
        style={styles.deleteContainer}
        onPress={onDeletePressHandler}>
        <IcDelete />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editContainer}
        onPress={onEditPressHandler}>
        <IcEdit />
      </TouchableOpacity>
    </View>
  );
  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      onSwipeableWillOpen={() => {
        setIsOpen(true);
      }}
      onSwipeableWillClose={() => setIsOpen(false)}
      renderRightActions={renderRightActionsHandler}
      containerStyle={[
        styles.shadowContainer,
        {paddingRight: isOpen ? 0 : 10},
      ]}>
      <View
        style={[
          styles.productItem,
          isOpen && {borderTopRightRadius: 0, borderBottomRightRadius: 0},
        ]}>
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
    </Swipeable>
  );
};

export default ProductItem;
