import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import MenuButton from '../components/MenuButton';
import Wallpaper from '../components/Wallpaper';


export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ headerTitle: <MenuButton navigation={navigation} title="Home" /> });

  constructor() {
    super();
    this.state = {
      supported: true,
      enabled: false,
    };
  }


  componentDidMount() {
    NfcManager.isSupported()
      .then((supported) => {
        this.setState({ supported });
        if (supported) {
          this.startNfc();
        }
      });
  }

  goToNfcSetting = () => {
    if (Platform.OS === 'android') {
      NfcManager.goToNfcSetting()
        .then((result) => {
          console.log('goToNfcSetting OK', result);
        })
        .catch((error) => {
          console.warn('goToNfcSetting fail', error);
        });
    }
  }

  startNfc() {
    NfcManager.start({
      onSessionClosedIOS: () => {
        console.log('ios session closed');
      }
    })
      .then((result) => {
        console.log('start OK', result);
      })
      .catch((error) => {
        console.warn('start fail', error);
        this.setState({ supported: false });
      });

    if (Platform.OS === 'android') {
      NfcManager.isEnabled()
        .then((enabled) => {
          this.setState({ enabled });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    const { supported, enabled } = this.state;

    return (
      <Wallpaper>
        <View style={styles.container}>
          <Text style={styles.titleText}>Welcome !</Text>

          <Text style={styles.infoText}>{`NFC ${supported ? 'is' : 'is not'} supported on your device`}</Text>

          {Platform.OS === 'android' && (
            <View>
              <Text style={styles.infoText}>{`NFC ${enabled ? 'is' : 'is not'} enabled on your device`}</Text>

              <TouchableOpacity onPress={this.goToNfcSetting}>
                <View style={styles.centerContainer}>
                  <Text style={styles.linkText}>Go to NFC setting</Text>
                </View>
              </TouchableOpacity>

            </View>
          )}

        </View>
      </Wallpaper>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
    marginBottom: 50,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  linkText: {
    color: 'pink',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
