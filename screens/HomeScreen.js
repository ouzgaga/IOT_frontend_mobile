import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,
} from 'react-native';
import MenuButton from '../navigation/MenuButton';
import storageManager from '../utils/StorageManager';
import SubmitButton from '../components/SubmitButton';

export default class HomeScreen extends React.Component {
  static navigationOptions =({ navigation })=> {
    return {headerTitle: <MenuButton navigation={navigation} title="Home"/>}
  };
  
  constructor() {
    super();
    this.state = {
      token: '',
    };

    storageManager.getToken().then(t => {
      if (t === undefined) {
      this.props.navigation.navigate('Auth')
      } else {
        this.setState({ token: t });
      }
    });
  }

  resetToken = () => {
    storageManager.clearValue(storageManager.TOKEN_KEY);
    this.props.navigation.navigate('Auth')
  }

  render() {

    return (
       <View style={styles.container}>
        <Text>Welcome on the HomeScreen !</Text>
        <Text>Here is your token: {this.state.token}</Text>
        <SubmitButton title="Reset token ?" onPress={this.resetToken} />
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
