import React from 'react';
import { View, StyleSheet } from 'react-native';
import MenuButton from '../navigation/MenuButton';
import App from 'react-native-nfc-manager/example/App'

export default class NFCReaderScreen extends React.Component {

  static navigationOptions =({ navigation })=> {
    return {headerTitle: <MenuButton navigation={navigation} title="NFC Reader"/>}
  };

  render() {
    return (
      <App/>
    );
  }
}

