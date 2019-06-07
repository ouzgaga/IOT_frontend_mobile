import React from 'react';
import {
  View, Text, StyleSheet, Platform,
} from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import MenuButton from '../components/MenuButton';
import Wallpaper from '../components/Wallpaper';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ headerTitle: <MenuButton navigation={navigation} title="NFC Reader" /> });

  constructor(props) {
    super(props);
    this.state = {
      NFCReadText: null,
    };


    props.navigation.addListener(
      'didBlur',
      () => {
        this.stopDetection();
      }
    );
    props.navigation.addListener(
      'didFocus',
      () => {
        NfcManager.isSupported()
          .then((supported) => {
            if (supported) {
              this.startNfc();
            }
          });
      }
    );
  }

  startDetection = () => {
    NfcManager.registerTagEvent(this.onTagDiscovered)
      .then((result) => {
        console.log('registerTagEvent OK', result);
      })
      .catch((error) => {
        console.warn('registerTagEvent fail', error);
      });
  }


  onTagDiscovered = (tag) => {
    const text = this.parseText(tag);

    this.setState({ NFCReadText: text });
  }

  stopDetection = () => {
    NfcManager.unregisterTagEvent()
      .then((result) => {
        console.log('unregisterTagEvent OK', result);
      })
      .catch((error) => {
        console.warn('unregisterTagEvent fail', error);
      });
  }

  parseText = (tag) => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
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
      });

    if (Platform.OS === 'android') {
      NfcManager.getLaunchTagEvent()
        .then((tag) => {
          console.log('launch tag', tag);
        })
        .catch((err) => {
          console.log(err);
        });
      NfcManager.isEnabled()
        .then(() => {
          this.startDetection();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    const { NFCReadText } = this.state;
    return (
      <Wallpaper>
        <View style={styles.container}>
          <Text style={styles.titleDetails}>Read text NFC</Text>

          {NFCReadText
            && (
              <Text style={styles.infoText}>{NFCReadText}</Text>
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
  titleDetails: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
    marginBottom: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    margin: 20,
  },
});
