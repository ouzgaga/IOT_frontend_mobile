import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, Router, Scene } from 'react-native-router-flux';

import LoginScreen from './src/activities/LoginScreen';
import SigninScreen from './src/activities/SigninScreen';
import HomeScreen from './src/activities/HomeScreen';
import DevicesListScreen from './src/activities/DevicesListScreen';

export default class App extends Component {
  render() {
    return (
      <Router style={styles.container}>
        <Stack key="root">
          <Scene key="homeScreen"
            component={HomeScreen}
            animation='fade'
            hideNavBar={true}
            initial={true}
          />
          <Scene key="loginScreen"
            component={LoginScreen}
            animation='fade'
            hideNavBar={true}
          />
          <Scene key="signinScreen"
            component={SigninScreen}
            animation='fade'
            hideNavBar={true}
          />
          <Scene key="deviceListScreen"
            component={DevicesListScreen}
            animation='fade'
            hideNavBar={true}
          />
        </Stack>
      </Router>
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
