import React, {Component} from 'react';
import { StyleSheet,
        KeyboardAvoidingView,
        TouchableOpacity,
        Image } from 'react-native';

import UserInput from './UserInput';
import SigninButtonSubmit from './SigninButtonSubmit';

import emailImg from '../images/email.png';
import usernameImg from '../images/username.png';
import passwordImg from '../images/password.png';
import serverImg from '../images/server.png';
import eyeImg from '../images/eye_black.png';

export default class SigninForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
    };
    this.showPass = this.showPass.bind(this);
  }

  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <UserInput
          source={serverImg}
          placeholder="Server"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
        />
        <UserInput
          source={usernameImg}
          placeholder="Username"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
        />
        <UserInput
          source={emailImg}
          placeholder="Email"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
        />
        <UserInput
          source={passwordImg}
          secureTextEntry={this.state.showPass}
          placeholder="Password"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
        />
        <SigninButtonSubmit />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  btnEye: {
    position: 'absolute',
    top: 55,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0, 0, 0, 0.2)',
  },
});
