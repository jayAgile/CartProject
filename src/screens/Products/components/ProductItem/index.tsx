import React, {useRef} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
//
import {IcDelete, IcEdit} from '../../../../constants';
import SkeletonLoading from 'react-native-skeleton-loading';

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

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const isSelected =
    selectedProductList?.find(
      obj => obj?.product_id === productItem?.product_id,
    ) !== undefined;

  return (
    <SkeletonLoading background={'#adadad'} highlight={'#ffffff'}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: '#adadad',
            borderRadius: 10,
          }}
        />

        <View style={{flex: 1, marginLeft: 10}}>
          <View
            style={{
              backgroundColor: '#adadad',
              width: '50%',
              height: 10,
              marginBottom: 3,
              borderRadius: 5,
            }}
          />
          <View
            style={{
              backgroundColor: '#adadad',
              width: '20%',
              height: 8,
              borderRadius: 5,
            }}
          />
          <View
            style={{
              backgroundColor: '#adadad',
              width: '15%',
              height: 8,
              borderRadius: 5,
              marginTop: 3,
            }}
          />
        </View>
      </View>
    </SkeletonLoading>
    // <SkeletonLoading background={'#adadad'} highlight={'#ffffff'}>
    //   <View
    //     style={[
    //       styles.productItem,
    //       isOpen && {borderTopRightRadius: 0, borderBottomRightRadius: 0},
    //     ]}>
    //     <Text style={styles.productName}>{productItem.name}</Text>
    //     <Text style={styles.productDescription}>{productItem.description}</Text>
    //     <Text style={styles.productPrice}>${productItem.price.toFixed(2)}</Text>
    //     {isSelected ? (
    //       <Text>Item Added To cart</Text>
    //     ) : (
    //       <Button
    //         title="Add to cart"
    //         onPress={onAddToCartPress.bind(null, productItem)}
    //       />
    //     )}
    //   </View>
    // </SkeletonLoading>

    // <Swipeable
    //   ref={swipeRef}
    //   friction={2}
    //   onSwipeableWillOpen={() => {
    //     setIsOpen(true);
    //   }}
    //   onSwipeableWillClose={() => setIsOpen(false)}
    //   renderRightActions={renderRightActionsHandler}
    //   containerStyle={[
    //     styles.shadowContainer,
    //     {paddingRight: isOpen ? 0 : 10},
    //   ]}>
    //   <View
    //     style={[
    //       styles.productItem,
    //       isOpen && {borderTopRightRadius: 0, borderBottomRightRadius: 0},
    //     ]}>
    //     <Text style={styles.productName}>{productItem.name}</Text>
    //     <Text style={styles.productDescription}>{productItem.description}</Text>
    //     <Text style={styles.productPrice}>${productItem.price.toFixed(2)}</Text>
    //     {isSelected ? (
    //       <Text>Item Added To cart</Text>
    //     ) : (
    //       <Button
    //         title="Add to cart"
    //         onPress={onAddToCartPress.bind(null, productItem)}
    //       />
    //     )}
    //   </View>
    // </Swipeable>
  );
};

export default ProductItem;
