import React, { Component } from 'react';
import { Platform, StyleSheet, StatusBar, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator } from "react-navigation";
import HomeScreen from './screens/HomeScreen';
import LinksScreen from './screens/LinksScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen'
import AuthLoadingScreen from './screens/AuthLoadingScreen'

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  title: 'www',
};

const AppNavigator = createDrawerNavigator({
  HomeStack,
  LinksStack,
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
