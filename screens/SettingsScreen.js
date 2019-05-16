import React from 'react';
import { View, StyleSheet } from 'react-native';
import MenuButton from '../navigation/MenuButton';
import storageManager from '../utils/StorageManager';
import SubmitButton from '../components/SubmitButton';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: <MenuButton navigation={navigation} title="Settings" /> }
  };

  resetToken() {
    storageManager.clearValue(storageManager.TOKEN_KEY);
    this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <View style={styles.container}>
        <SubmitButton title="Reset token ?" onPress={() => this.resetToken()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
