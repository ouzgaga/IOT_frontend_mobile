import React, { Component } from 'react';
import { StyleSheet, Text, Alert,
        KeyboardAvoidingView, View } from 'react-native';
import Dimensions from 'Dimensions';

import UserInput from './UserInput';
import SubmitButton from '../components/SubmitButton';

import emailImg from '../assets/images/email.png';
import passwordImg from '../assets/images/password.png';
import serverImg from '../assets/images/server.png';
import storageManager from '../utils/StorageManager';

const defaultValue = {
  server: "https://heig-iot-backend.herokuapp.com",
  email: "admin@iot.com",
  password: "mySuperPassword",
}

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverAddr: defaultValue.server,
      email: defaultValue.email,
      password: defaultValue.password,
      error: '',
      isLoading: false,
    };
  }

  auth = async () => {
    if (this.state.serverAddr === '' || this.state.email === '' || this.state.password === '') {
      this.setState({ error: `At least one field is empty.` });
    }
    else {
      this.setState({ isLoading: true });
      try {
        console.log(`${this.state.serverAddr}/accounts/authentication`);
        const response = await fetch(`${this.state.serverAddr}/accounts/authentication`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
        });
        const responseJSON = await response.json();

        if (response.status === 201) {
          this.setState({ error: 'SUCCESS' });
          storageManager.setToken(responseJSON.token);
          this.props.navigation.navigate('App');
        }
        else {
          if (responseJSON.status !== undefined && responseJSON.status !== '')
            this.setState({ error: responseJSON.error });
          else
            this.setState({ error: 'An error occured. Maybe check the server URL ?' });
        }
      } catch(error) {
        this.setState({ error: 'An error occured. Maybe check the server URL ?' });
        console.log(error);
      }
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
          placeholder="Server https://"
          autoCapitalize={'none'}
          returnKeyType={'next'}
          autoCorrect={false}
          defaultValue={defaultValue.server}
          onChange={(v) => { this.setState({ serverAddr: v }); }}
        />
        <UserInput
          source={emailImg}
          placeholder="Email"
          autoCapitalize={'none'}
          returnKeyType={'next'}
          autoCorrect={false}
          defaultValue={defaultValue.email}
          onChange={(v) => { this.setState({ email: v }); }}
        />
        <UserInput
          source={passwordImg}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
          defaultValue={defaultValue.email}
          onChange={(v) => { this.setState({ password: v }); }}
        />
        <SubmitButton title="Login" onPress={() => this.auth()} isLoading={this.state.isLoading} />
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
