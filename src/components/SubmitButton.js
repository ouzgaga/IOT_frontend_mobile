import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import Layout from '../constants/Layout';

const MARGIN = 40;

export default class SubmitButton extends Component {
  onPress = () => {
    const { onPress } = this.props;
    onPress();
  }


  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPress}
          activeOpacity={1}
        >

          <Text style={styles.text}>{title}</Text>

        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: MARGIN / 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F035E0',
    height: MARGIN,
    width: '90%',
    borderRadius: 20,
    zIndex: 100,
  },
  text: {
    width: Layout.window.width - MARGIN,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
  },
});
