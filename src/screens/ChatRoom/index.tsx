import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {IcPending, IcSent} from '../../constants';
import {Status} from '../../enum/common';
import {
  checkAndSendPendingMessages,
  openDatabase,
} from '../../utils/chatManager';

export const ChatRoom = () => {
  const route =
    useRoute<
      RouteProp<{ChatRoom: {chatId: number; contactName: string}}, 'ChatRoom'>
    >();
  const {chatId, contactName} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [input, setInput] = useState('');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      loadMessages();
      if (state.isConnected) {
        console.log('Internet is available. Checking for pending messages...');
        checkAndSendPendingMessages().then(message => {
          return sendMessageToServer(message);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const loadMessages = async () => {
    const db = await openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages WHERE chatId = ? ORDER BY timestamp ASC',
        [chatId],
        (_, results) => {
          const rows = results.rows.raw();
          console.log('🚀 ~ loadMessages ~ rows:', rows);
          setMessages(rows);
        },
        error => {
          console.error('Error fetching chats:', error);
        },
      );
    });
  };

  const sendMessageToServer = async (message: Message) => {
    // If successful, update the status to "sent"
    const db = await openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE messages SET status = 'sent' WHERE id = ?",
        [message.id],
        () => {
          console.log(`Message ${message.id} status updated to sent`);
          loadMessages();
        },
      );
    });
  };

  const sendMessage = async () => {
    if (input.length === 0) {
      return;
    }
    const db = await openDatabase();
    const status = isConnected ? Status.SENT : Status.PENDING;
    await db.executeSql(
      'INSERT INTO messages (chatId, sender, content, status) VALUES (?, ?, ?, ?)',
      [chatId, 'me', input, status],
    );
    setInput('');
    loadMessages(); // Refresh messages
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.txtStyle}>{contactName}</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View
            style={[
              styles.itemContainer,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                alignSelf: item.sender === 'me' ? 'flex-end' : 'flex-start',
              },
            ]}>
            <Text>{item.content}</Text>
            <View style={styles.iconStyle}>
              {item.status === Status.SENT ? <IcSent /> : <IcPending />}
            </View>
          </View>
        )}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
        style={styles.inputStyle}
      />
      <Button title="Send" onPress={sendMessage} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  txtStyle: {fontSize: 18, fontWeight: 'bold'},
  itemContainer: {
    padding: 8,
    backgroundColor: 'lightgray',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
  },
  itemTextStyle: {fontSize: 10},
  inputStyle: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  iconStyle: {
    alignSelf: 'flex-end',
  },
});
