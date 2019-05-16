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
          <LoginForm navigation={this.props.navigation}/>
          <View style={styles.authLinkSection}>
            <Text style={styles.text}>Create an account ?</Text>
            <Text style={styles.text}>Forgot Password?</Text>
          </View>
        </View>
      </Wallpaper>

    );
  }
}


const styles = StyleSheet.create({
  authLinkSection: {
    flex: 1,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  wallpaper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  }
});