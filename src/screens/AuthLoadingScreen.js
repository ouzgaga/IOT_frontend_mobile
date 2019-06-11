import React from 'react';
import {
  StatusBar,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../components/Loader';
import VideoNodesAPI from '../api/VideoNodesAPI';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };

    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    const { navigation } = this.props;
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');

    this.setState({ isLoading: true });
    const response = await VideoNodesAPI.login(email, password);

    this.setState({ isLoading: false });

    if (response.token) {
      AsyncStorage.setItem('token', response.token);
      navigation.navigate('App');
    } else {
      navigation.navigate('Auth');
    }
  };

  // Render any loading content that you like here
  render() {
    const { isLoading } = this.state;
    return (
      <View>
        <Loader visible={isLoading} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
