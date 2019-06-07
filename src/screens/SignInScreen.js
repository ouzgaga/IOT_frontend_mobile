import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Logo from '../components/Logo';
import Wallpaper from '../components/Wallpaper';
import LoginForm from '../components/LoginForm';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    return (
      <Wallpaper>
        <View style={styles.wallpaper}>
          <Logo />
          <LoginForm navigation={navigation} />
        </View>
      </Wallpaper>
    );
  }
}


const styles = StyleSheet.create({
  wallpaper: {
    flex: 1,
    flexDirection: 'column',
  }
});
