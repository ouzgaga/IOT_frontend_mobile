import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class DevicesListScreen extends Component {
  render() {
    return (
      <Text style={styles.welcome}>Here are the devices</Text>
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
