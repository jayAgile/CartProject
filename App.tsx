/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ChatList, ChatRoom} from './src/screens';
import {
  closeDatabase,
  createTables,
  openDatabase,
} from './src/utils/chatManager';

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
      // await openDatabase(); // Ensure the database is created/opened
      await openDatabase(); // Ensure the database is created/opened
      // await printDbLocation(); // Print the database location
      // await createTables(); // Create tables
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="ChatList" component={ChatList} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
