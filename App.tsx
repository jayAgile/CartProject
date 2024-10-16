/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {data} from './src/constants';
import SwipableItem from './src/components/SwipableItem';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const renderSwipableItem = (dataItem: dataItem) => {
    return <SwipableItem dataItem={dataItem} />;
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={({item}) => renderSwipableItem(item)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
