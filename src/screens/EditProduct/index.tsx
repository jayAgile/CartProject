import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {updateProduct} from '../../utils/productManager';

const EditProduct = () => {
  const route =
    useRoute<
      RouteProp<{EditProduct: {productItem: ProductItem}}, 'EditProduct'>
    >();
  const {productItem} = route.params;
  const [title, setProductTitle] = React.useState<string>(productItem.name);
  const navigation =
    useNavigation<NavigationProp<{EditProduct: {productItem: ProductItem}}>>();

  const onTextChangeHandler = (text: string) => {
    setProductTitle(text);
  };

  const onUpdate = async () => {
    if (title) {
      await updateProduct(productItem.product_id, title);
      navigation.goBack();
    } else {
      Alert.alert('Please Enter Product Title');
    }
  };

  return (
    <View>
      <Text>EditProduct</Text>
      <TextInput
        placeholder="Edit Your Product Here"
        value={title}
        onChangeText={onTextChangeHandler}
      />
      <Button title="Update" onPress={onUpdate} />
    </View>
  );
};

export default EditProduct;

const styles = StyleSheet.create({});
