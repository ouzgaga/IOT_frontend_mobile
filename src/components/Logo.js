import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Logo extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>HEIG IOT Mobile</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
    marginBottom: 20,
  }
});
