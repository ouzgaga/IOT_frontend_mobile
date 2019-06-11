import React, { Component } from 'react';
import {
  StyleSheet, Text, View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Layout from '../constants/Layout';
import UserInput from './UserInput';
import SubmitButton from './SubmitButton';
import emailImg from '../assets/images/email.png';
import passwordImg from '../assets/images/password.png';
import VideoNodesAPI from '../api/VideoNodesAPI';
import Loader from './Loader';

const defaultValue = {
  email: 'admin@iot.com',
  password: 'mySuperPassword',
};

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: defaultValue.email,
      password: defaultValue.password,
      error: '',
      isLoading: false,
    };
  }

  auth = async () => {
    const { email, password } = this.state;
    const { navigation } = this.props;
    if (email === '' || password === '') {
      this.setState({ error: 'At least one field is empty.' });
    } else {
      this.setState({ isLoading: true });
      const response = await VideoNodesAPI.login(email, password);

      this.setState({ isLoading: false });

      if (response.token) {
        this.setState({ error: 'SUCCESS' });
        AsyncStorage.setItem('token', response.token);
        AsyncStorage.setItem('email', email);
        AsyncStorage.setItem('password', password);
        navigation.navigate('App');
      } else {
        this.setState({ error: 'Maybe bad credentials' });
      }
    }
  }

  render() {
    const { isLoading, error } = this.state;
    return (
      <View behavior="padding" style={styles.container}>

        <Loader visible={isLoading} />

        {
          (error.length > 0) && (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>
                Error:
                {' '}
                {error}
              </Text>
            </View>
          )
        }

        <UserInput
          source={emailImg}
          placeholder="Email"
          autoCapitalize="none"
          returnKeyType="next"
          autoCorrect={false}
          defaultValue={defaultValue.email}
          onChange={(v) => { this.setState({ email: v }); }}
        />
        <UserInput
          source={passwordImg}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          returnKeyType="done"
          autoCorrect={false}
          defaultValue={defaultValue.email}
          onChange={(v) => { this.setState({ password: v }); }}
        />
        <SubmitButton title="Login" onPress={() => this.auth()} />
      </View>
    );
  }
}

const DEVICE_WIDTH = Layout.window.width;
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
