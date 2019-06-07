import React from 'react';
import { View, StyleSheet } from 'react-native';
import MenuButton from '../components/MenuButton';
import storageManager from '../utils/StorageManager';
import SubmitButton from '../components/SubmitButton';
import Wallpaper from '../components/Wallpaper';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ headerTitle: <MenuButton navigation={navigation} title="Settings" /> });

  resetToken() {
    const { navigation } = this.props;
    storageManager.clearValue(storageManager.TOKEN_KEY);
    navigation.navigate('Auth');
  }

  render() {
    return (
      <Wallpaper>
        <View style={styles.container}>
          <SubmitButton title="Log Out" onPress={() => this.resetToken()} />
        </View>
      </Wallpaper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
