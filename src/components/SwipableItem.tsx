import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {IcDelete, IcEdit} from '../constants';

interface SwipableItemProps {
  dataItem: dataItem;
}

const SwipableItem = (props: SwipableItemProps) => {
  const {dataItem} = props;
  const renderRightActionsHandler = () => {
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.deleteContainer}>
          <IcDelete />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editContainer}>
          <IcEdit />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Swipeable
      containerStyle={styles.container}
      rightThreshold={10}
      renderRightActions={renderRightActionsHandler}>
      <Text>{dataItem.title}</Text>
    </Swipeable>
  );
};

export default SwipableItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  deleteContainer: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  editContainer: {
    backgroundColor: 'lightblue',
    paddingHorizontal: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
