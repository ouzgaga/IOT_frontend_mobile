import React from 'react';
import { Platform, View, ScrollView } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

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

export default createDrawerNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});