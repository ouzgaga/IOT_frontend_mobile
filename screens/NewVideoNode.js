import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuButton from '../navigation/MenuButton';
import storageManager from '../utils/StorageManager';
import SubmitButton from '../components/SubmitButton';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: <MenuButton navigation={navigation} title="New Lora Node" /> }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Yo new Video node</Text>
      </View>
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
