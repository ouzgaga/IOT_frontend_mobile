import React, { Component } from 'react'
import { View, Image, Text, ActivityIndicator, Modal, StyleSheet } from 'react-native';


export default class Loader extends Component {
  render() {
    const { visible } = this.props;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        >
        <View style={styles.wrapper}>
          <View style={styles.loaderImage}>
          <ActivityIndicator size="large" color="#0000ff" />

          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
    backgroundColor:'rgba(0,0,0,0.6)',
    
  },
  loaderImage:{
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',

  }, 
  loaderContent:{
    width: 90,
    height: 90,
  }
})
