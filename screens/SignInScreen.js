import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
import Logo from '../components/Logo';
import Wallpaper from '../components/Wallpaper';
import LoginForm from '../components/LoginForm';

const DEVICE_WIDTH = Dimensions.get('window').width;

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Wallpaper>
        <View style={styles.wallpaper}>
          <Logo />
          <LoginForm navigation={this.props.navigation} />
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