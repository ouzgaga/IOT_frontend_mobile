import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator } from "react-navigation";
import HomeScreen from './screens/HomeScreen';
import NFCReaderScreen from './screens/NFCReaderScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen'
import AuthLoadingScreen from './screens/AuthLoadingScreen'

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const NodesStack = createStackNavigator({
  Nodes: HomeScreen,
});

const NFCReaderStack = createStackNavigator({
  NFCReader: NFCReaderScreen,
});

NFCReaderStack.navigationOptions = {
  title: 'NFC Reader',
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});


const AppNavigator = createDrawerNavigator({
  HomeStack,
  NodesStack,
  NFCReaderStack,
  SettingsStack,
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
