import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { Actions } from 'react-native-router-flux';
import storageManager from '../utils/StorageManager';
import SubmitButton from '../components/SubmitButton';

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
    };

    storageManager.getToken().then(t => {
      if (t === undefined)
        Actions.loginScreen();
      this.setState({ token: t });
    });

    this.resetToken = this.resetToken.bind(this);
  }

  resetToken() {
    storageManager.clearValue(storageManager.TOKEN_KEY);
    Actions.loginScreen();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome on the HomeScreen !</Text>
        <Text>Here is your token: {this.state.token}</Text>
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
