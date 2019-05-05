import React, {Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Dimensions from 'Dimensions';

import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';
import Wallpaper from '../components/Wallpaper';
import { Actions } from 'react-native-router-flux';

const DEVICE_WIDTH = Dimensions.get('window').width;

export default class LoginScreen extends Component {
  render() {
    return (
      <Wallpaper>
        <Logo />
        <LoginForm />
        <View style={styles.authLinkSection}>
          <Text style={styles.text} onPress={() => { Actions.signinScreen(); }}>Create an account ?</Text>
          <Text style={styles.text}>Forgot Password?</Text>
        </View>
      </Wallpaper>
    );
  }
}

const styles = StyleSheet.create({
  authLinkSection: {
    flex: 1,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
});