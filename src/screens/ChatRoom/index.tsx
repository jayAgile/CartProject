import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
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
import {openDatabase} from '../../utils/chatManager';
import {Transaction} from 'react-native-sqlite-storage';
import {IcPending, IcSent} from '../../constants';
import {RouteProp, useRoute} from '@react-navigation/native';

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
    NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('Internet is available. Checking for pending messages...');
        checkAndSendPendingMessages();
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const checkAndSendPendingMessages = async () => {
    const db = await openDatabase();

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages WHERE status = ?',
        ['pending'],
        (txd, results) => {
          const pendingMessages = results.rows.raw();

          pendingMessages.forEach(async message => {
            try {
              // Attempt to send the message to the server
              await sendMessageToServer(message, txd);
            } catch (error) {
              console.error('Failed to send message:', error);
            }
          });
        },
        error => console.error('Error fetching pending messages:', error),
      );
    });
  };

  const sendMessageToServer = async (message: Message, tx: Transaction) => {
    // If successful, update the status to "sent"
    tx.executeSql(
      "UPDATE messages SET status = 'sent' WHERE id = ?",
      [message.id],
      () => {
        console.log(`Message ${message.id} status updated to sent`);
        loadMessages();
      },
    );
  };

  const sendMessage = async () => {
    const db = await openDatabase();
    const status = isConnected ? 'sent' : 'pending';
    await db.executeSql(
      'INSERT INTO messages (chatId, sender, content, status) VALUES (?, ?, ?, ?)',
      [chatId, 'me', input, status],
    );

    if (isConnected) {
      // Sync with server or send message API here
    }

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
              {item.status === 'sent' ? <IcSent /> : <IcPending />}
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
