import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {openDatabase} from '../../utils/chatManager';
import {ResultSet} from 'react-native-sqlite-storage';

export const ChatList = () => {
  const [chats, setChats] = useState<any[]>([]);
  const isFocused = useIsFocused(); // Check if the screen is focused
  const navigation =
    useNavigation<
      NavigationProp<{ChatRoom: {chatId: number; contactName: string}}>
    >();

  useEffect(() => {
    if (isFocused) {
      loadChats(); // Load chats each time screen is focused
    }
  }, [isFocused]);

  const loadChats = async () => {
    try {
      const db = await openDatabase();

      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM chats ORDER BY timestamp DESC',
          [],
          (_, results: ResultSet) => {
            const rows = results.rows.raw(); // Works with SQLite's results format
            setChats(rows);
          },
          error => {
            console.error('Error fetching chats:', error);
          },
        );
      });
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const navigateToChatRoom = (chatId: number, contactName: string) => {
    navigation.navigate('ChatRoom', {chatId, contactName});
  };

  return (
    <FlatList
      data={chats}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => navigateToChatRoom(item.id, item.contactName)}>
          <View style={styles.itemContainer}>
            <Text style={styles.fontweight}>{item.contactName}</Text>
            <Text>{item.lastMessage}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {padding: 16},
  fontweight: {fontWeight: 'bold'},
});
