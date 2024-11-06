import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Button, FlatList, StyleSheet, View} from 'react-native';
import {ResultSet} from 'react-native-sqlite-storage';
import {openDatabase} from '../../utils/chatManager';
import ChatItem from './components/ChatItem';

export const ChatList = () => {
  const [chats, setChats] = useState<any[]>([]);
  const isFocused = useIsFocused(); // Check if the screen is focused

  useEffect(() => {
    if (isFocused) {
      loadChats(); // Load chats each time screen is focused
    }
  }, [isFocused]);

  const addNewChat = async () => {
    // Open the database and insert a new chat
    const db = await openDatabase();

    // Insert a new chat with placeholder data
    await db.executeSql('INSERT INTO chats (contactName) VALUES (?)', [
      'Test User',
    ]);

    // Navigate to the Chat List screen to view the updated list
    loadChats();
  };

  const loadChats = async () => {
    try {
      const db = await openDatabase();

      db.transaction(tx => {
        // Check if the "chats" table exists
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='chats'",
          [],
          (_, result: ResultSet) => {
            if (result.rows.length > 0) {
              // If table exists, load the chats
              tx.executeSql(
                'SELECT * FROM chats ORDER BY timestamp DESC',
                [],
                (_, results: ResultSet) => {
                  const rows = results.rows.raw(); // Extract rows
                  setChats(rows);
                },
                error => {
                  console.error('Error fetching chats:', error);
                },
              );
            } else {
              console.log("Table 'chats' does not exist.");
            }
          },
          error => {
            console.error('Error checking table existence:', error);
          },
        );
      });
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const renderHeaderComponent = () => {
    return (
      <View style={styles.container}>
        <Button title="Add New Chat" onPress={addNewChat} />
      </View>
    );
  };

  return (
    <FlatList
      data={chats}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <ChatItem item={item} isFocused={isFocused} />}
      ListHeaderComponent={renderHeaderComponent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewStyle: {marginVertical: 10},
});
