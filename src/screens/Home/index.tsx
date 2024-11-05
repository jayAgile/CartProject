import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {openDatabase} from '../../utils/chatManager';

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<{ChatList: {}}>>();

  const addNewChat = async () => {
    // Open the database and insert a new chat
    const db = await openDatabase();

    // Insert a new chat with placeholder data
    await db.executeSql(
      'INSERT INTO chats (contactName, lastMessage) VALUES (?, ?)',
      ['New Contact', 'This is the first message'],
    );

    // Navigate to the Chat List screen to view the updated list
    navigation.navigate('ChatList', {});
  };
  const navigateToChat = () => {
    navigation.navigate('ChatList', {});
  };

  return (
    <View style={styles.container}>
      <Button title="Add New Chat" onPress={addNewChat} />
      <View style={styles.viewStyle} />
      <Button title="Chatlist" onPress={navigateToChat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewStyle: {marginTop: 20},
});
