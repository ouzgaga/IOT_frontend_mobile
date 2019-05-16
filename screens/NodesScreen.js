import React from 'react';
import { View } from 'react-native';
import MenuButton from '../navigation/MenuButton';
import SubmitButton from '../components/SubmitButton';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: <MenuButton navigation={navigation} title="Nodes" /> }
  };

  render() {
    return (
      <View style={styles.container}>
        <SubmitButton title="Reset token ?" onPress={() => this.resetToken()} />
      </View>
    );
  }
}
