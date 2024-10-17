/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {
  closeDatabase,
  createTables,
  openDatabase,
  printDbLocation,
} from './src/utils/productManager';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartScreen, ProductsScreen} from './src/screens';
import SwiperDemo from './src/screens/SwiperDemo';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import EditProduct from './src/screens/EditProduct';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    initializeDatabase();
    return () => {
      closeDatabase();
    };
  }, []);

  // Initialize the database
  const initializeDatabase = async () => {
    try {
      await openDatabase(); // Ensure the database is created/opened
      await printDbLocation(); // Print the database location
      await createTables(); // Create tables
    } catch (error) {
      console.log('Error initializing database:', error);
    }
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="MyCart" component={CartScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default App;
