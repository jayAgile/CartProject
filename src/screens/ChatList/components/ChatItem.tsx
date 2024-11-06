import NetInfo from '@react-native-community/netinfo';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ResultSet} from 'react-native-sqlite-storage';
import {IcPending, IcSent} from '../../../constants';
import {
  checkAndSendPendingMessages,
  openDatabase,
} from '../../../utils/chatManager';
import {Status} from '../../../enum/common';

interface ChatItemProps {
  item: ChatItem;
  isFocused: boolean;
}

const ChatItem = (props: ChatItemProps) => {
  const {item, isFocused} = props;
  const navigation =
    useNavigation<
      NavigationProp<{ChatRoom: {chatId: number; contactName: string}}>
    >();
  const [lastMessage, setLastMessage] = useState<Message | undefined>();

  useEffect(() => {
    if (isFocused) {
      getLastMessage();
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('Internet is available. Checking for pending messages...');
        checkAndSendPendingMessages().then(message => {
          return sendMessageToServer(message);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const sendMessageToServer = async (message: Message) => {
    // If successful, update the status to "sent"
    const db = await openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE messages SET status = 'sent' WHERE id = ?",
        [message.id],
        () => {
          console.log(`Message ${message.id} status updated to sent`);
          getLastMessage();
        },
      );
    });
  };

  const navigateToChatRoom = (chatId: number, contactName: string) => {
    navigation.navigate('ChatRoom', {chatId, contactName});
  };

  const getLastMessage = async () => {
    const db = await openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages WHERE chatId = ? ORDER BY timestamp DESC LIMIT 1',
        [item.id],
        (_, results: ResultSet) => {
          if (results.rows.length > 0) {
            const lastMessage = results.rows.item(0);
            console.log('Last message:', lastMessage);
            setLastMessage(lastMessage);
          } else {
            console.log('No messages found for this chat');
          }
        },
        error => {
          console.error('Error fetching the last message:', error);
        },
      );
    });
  };

  return (
    <TouchableOpacity
      onPress={() => navigateToChatRoom(item.id, item.contactName)}>
      <View style={styles.itemContainer}>
        <Text style={styles.fontweight}>{item.contactName}</Text>
        <View style={styles.iconStyle}>
          {lastMessage?.status === Status.SENT ? (
            <IcSent />
          ) : (
            lastMessage?.content && <IcPending />
          )}
          {lastMessage?.content && (
            <Text style={styles.textStyle}>{lastMessage?.content}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  itemContainer: {padding: 16},
  fontweight: {fontWeight: 'bold'},
  iconStyle: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
  },
  textStyle: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
