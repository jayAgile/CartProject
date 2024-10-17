import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface AppModalProps {
  isLoading: boolean;
}

export default function AppModal(props: AppModalProps) {
  const {isLoading} = props;
  return (
    <Modal
      animationType="fade"
      visible={isLoading}
      transparent
      statusBarTranslucent>
      <View style={styles.container}>
        {/* Loader component */}
        <ActivityIndicator size="large" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
