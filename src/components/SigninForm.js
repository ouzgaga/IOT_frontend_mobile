import React, { Component } from 'react';
import {
  StyleSheet, KeyboardAvoidingView,
  Text, View
} from 'react-native';
import Dimensions from 'Dimensions';
import { Actions } from 'react-native-router-flux';

import UserInput from './UserInput';
import SubmitButton from './SubmitButton';

import emailImg from '../assets/images/email.png';
import usernameImg from '../assets/images/username.png';
import passwordImg from '../assets/images/password.png';
import serverImg from '../assets/images/server.png';

export default class SigninForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverAddr: '',
      email: '',
      username: '',
      password: '',
      error: '',
      loading: false,
    }
    this.register = this.register.bind(this);
  }

  async register() {
    if (this.state.serverAddr === '' || this.state.username === '' ||
      this.state.email === '' || this.state.password === '') {
      this.setState({ error: `At least one field is empty.` });
    }
    else {
      this.setState({ loading: true });

      try {
        const response = await fetch(`${this.state.serverAddr}/accounts/registration`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
          }),
        });
        console.log("RESPONSE:");
        console.log(response);

        if (response.status === 201) {
          this.setState({ error: 'SUCCESS' });
          Actions.loginScreen();
        }
        else {
          this.setState({ error: 'The server answered: no.' });
        }
      } catch (error) {
        this.setState({ error: 'An error occured. Maybe check the server URL ?' });
        console.log(error);
      }

      this.setState({ loading: false });

    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        {
          (this.state.error.length > 0) && (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>Error: {this.state.error}</Text>
            </View>
          )
        }
        <UserInput
          source={serverImg}
          placeholder="Server"
          autoCapitalize={'none'}
          returnKeyType={'next'}
          autoCorrect={false}
          onChange={(v) => { this.setState({ serverAddr: v }); }}
        />
        <UserInput
          source={usernameImg}
          placeholder="Username"
          autoCapitalize={'none'}
          returnKeyType={'next'}
          autoCorrect={false}
          onChange={(v) => { this.setState({ username: v }); }}
        />
        <UserInput
          source={emailImg}
          placeholder="Email"
          autoCapitalize={'none'}
          returnKeyType={'next'}
          autoCorrect={false}
          onChange={(v) => { this.setState({ email: v }); }}
        />
        <UserInput
          source={passwordImg}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
          onChange={(v) => { this.setState({ password: v }); }}
        />
        <SubmitButton title="Sign in" loading={this.state.loading} onPress={() => this.register()} />
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const MARGIN = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  errorView: {
    width: DEVICE_WIDTH - MARGIN,
    margin: 20,
    padding: 10,
    backgroundColor: 'rgba(242, 222, 222, 0.8)',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'rgb(169, 68, 66)',
    borderRadius: 20,
  },
  errorText: {
    color: 'rgb(169, 68, 66)',
    fontWeight: 'bold',
  }
});
