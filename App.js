import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator } from "react-navigation";
import HomeScreen from './screens/HomeScreen';
import NodesScreen from './screens/NodesScreen'
import NFCReaderScreen from './screens/NFCReaderScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen'
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import NewLoraNodeScreen from './screens/NewLoraNodeScreen'
import LoraNodeStandByScreen from './screens/LoraNodeStandByScreen'

import NewVideoNode from './screens/NewVideoNodeScreen'

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  title: 'Home',
};

const NodesStack = createStackNavigator({
  Nodes: NodesScreen,
});

NodesStack.navigationOptions = {
  title: 'Nodes',
};

const NewLoraNodeStack = createStackNavigator({
  Nodes: NewLoraNodeScreen,
});

NewLoraNodeStack.navigationOptions = {
  title: 'New Lora Node',
};

const LoraNodeStandByStack = createStackNavigator({
  Nodes: LoraNodeStandByScreen,
});

LoraNodeStandByStack.navigationOptions = {
  title: 'Lora Node stand-by',
};

const NewVideoNodeStack = createStackNavigator({
  Nodes: NewVideoNode,
});

NewVideoNodeStack.navigationOptions = {
  title: 'New Video Node',
};

const NFCReaderStack = createStackNavigator({
  NFCReader: NFCReaderScreen,
});

NFCReaderStack.navigationOptions = {
  title: 'NFC Reader',
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  title: 'Settings',
};

const AppNavigator = createDrawerNavigator({
  HomeStack,
  NewLoraNodeStack,
  LoraNodeStandByStack,
  NewVideoNodeStack,
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
