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
import NfcManager from 'react-native-nfc-manager';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: <MenuButton navigation={navigation} title="Home" /> }
  };

  constructor() {
    super();
    this.state = {
      token: '',
      supported: true,
      enabled: false,
    };

    storageManager.getToken().then(t => {
      if (t === undefined) {
        this.props.navigation.navigate('Auth')
      } else {
        this.setState({ token: t });
      }
    });
  }


  componentDidMount() {
    NfcManager.isSupported()
      .then(supported => {
        this.setState({ supported });
        if (supported) {
          this._startNfc();
        }
      })
  }

  componentWillUnmount() {
    if (this._stateChangedSubscription) {
      this._stateChangedSubscription.remove();
    }
  }

  _startNfc() {
    NfcManager.start({
      onSessionClosedIOS: () => {
        console.log('ios session closed');
      }
    })
      .then(result => {
        console.log('start OK', result);
      })
      .catch(error => {
        console.warn('start fail', error);
        this.setState({ supported: false });
      })

    if (Platform.OS === 'android') {
      NfcManager.getLaunchTagEvent()
        .then(tag => {
          console.log('launch tag', tag);
          if (tag) {
            this.setState({ tag });
          }
        })
        .catch(err => {
          console.log(err);
        })
      NfcManager.isEnabled()
        .then(enabled => {
          this.setState({ enabled });
        })
        .catch(err => {
          console.log(err);
        })
      NfcManager.onStateChanged(
        event => {
          if (event.state === 'on') {
            this.setState({ enabled: true });
          } else if (event.state === 'off') {
            this.setState({ enabled: false });
          } else if (event.state === 'turning_on') {
            // do whatever you want
          } else if (event.state === 'turning_off') {
            // do whatever you want
          }
        }
      )
        .then(sub => {
          this._stateChangedSubscription = sub;
          // remember to call this._stateChangedSubscription.remove()
          // when you don't want to listen to this anymore
        })
        .catch(err => {
          console.warn(err);
        })
    }
  }


  _goToNfcSetting = () => {
    if (Platform.OS === 'android') {
      NfcManager.goToNfcSetting()
        .then(result => {
          console.log('goToNfcSetting OK', result)
        })
        .catch(error => {
          console.warn('goToNfcSetting fail', error)
        })
    }
  }


  render() {
    let { supported, enabled } = this.state;

    return (
      <View style={styles.container}>
        <Text>Welcome !</Text>

        <Text>{`Is NFC supported ? ${supported}`}</Text>
        <Text>{`Is NFC enabled (Android only)? ${enabled}`}</Text>


        <TouchableOpacity style={{ marginTop: 20 }} onPress={this._goToNfcSetting}>
          <Text >(android) Go to NFC setting</Text>
        </TouchableOpacity>

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
