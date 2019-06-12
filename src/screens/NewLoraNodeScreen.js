import React from 'react';
import {
  View, Text, StyleSheet, Platform, Alert
} from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import MenuButton from '../components/MenuButton';
import SubmitButton from '../components/SubmitButton';
import Wallpaper from '../components/Wallpaper';
import Loader from '../components/Loader';
import UserInput from '../components/UserInputNewNode';
import LoraNodesAPI from '../api/LoraNodesAPI';

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([
    Ndef.textRecord(valueToWrite),
  ]);
}

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ headerTitle: <MenuButton navigation={navigation} title="New Lora Node" /> });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loraNodeName: '',
      loraNameDescription: '',
      detectionNFC: false,
      isWriting: false,
      NFCReadText: false,
      nodeUID: null,
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

    // TODO : voir format des données lues par NFC

    this.setState({ nodeUID: text });
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

  sendToBackEnd = async () => {
    const { loraNodeName, loraNameDescription, nodeUID } = this.state;

    if (loraNodeName === '' || loraNameDescription === '') {
      Alert.alert(
        'Text Fields empty',
        'The name and the description must not be empty',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    } else {
      this.setState({ loading: true });
      const response = await LoraNodesAPI.addLoraNode(loraNodeName, loraNameDescription, nodeUID);
      this.setState({
        detectionNFC: true
      });
      if (response) {
        // TODO : utiliser la response ici
        const APPEUI = response.appEui;
        const APPKEY = response.appKey;

        // TODO : voir la structure des données, ici données séparée par un ';'
        const infosToWrite = `${APPKEY};${APPEUI};${nodeUID}`;

        this.requestNdefWrite(infosToWrite);
      } else {
        Alert.alert(
          'Error',
          'The server seems not happy',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
      }
      this.setState({ loading: false });
    }
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

  requestNdefWrite = (text) => {
    const { isWriting } = this.state;
    if (isWriting) {
      return;
    }

    const bytes = buildTextPayload(text);

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(bytes)
      .then(() => {
        this.cancelNdefWrite();

        Alert.alert(
          'New device',
          'Congrats, the node has been registred',
          [
            {
              text: 'OK',
              onPress: () => {
                this.setState({
                  loraNodeName: '',
                  loraNameDescription: '',
                  detectionNFC: false,
                  NFCReadText: null,
                  nodeUID: null,
                });
              }
            },
          ],
          { cancelable: false },
        );
      })
      .catch(err => console.warn(err));
  }

  cancelNdefWrite = () => {
    this.setState({ isWriting: false });
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
    const { detectionNFC, NFCReadText, loading } = this.state;
    return (
      <Wallpaper>

        <Loader visible={loading} />

        <View style={styles.container}>

          {NFCReadText ? (
            detectionNFC ? (
              <View style={styles.container}>
                <Text style={styles.infoText}>Scan the Node to write inside</Text>
              </View>
            )
              : (
                <View style={styles.loraNodeDetails}>

                  <Text style={styles.titleDetails}>Enter Lora Node name and description</Text>
                  <UserInput
                    placeholder="Name"
                    autoCapitalize="none"
                    returnKeyType="next"
                    autoCorrect={false}
                    onChange={(v) => { this.setState({ loraNodeName: v }); }}
                  />

                  <UserInput
                    placeholder="Description"
                    autoCapitalize="none"
                    returnKeyType="next"
                    autoCorrect={false}
                    onChange={(v) => { this.setState({ loraNameDescription: v }); }}
                  />

                  <SubmitButton title="Submit" isLoading={loading} onPress={this.sendToBackEnd} />
                </View>
              )
          )
            : (
              <Text style={styles.infoText}>Scan the Lora Node to register it</Text>
            )
          }
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
  loraNodeDetails: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameTextInput: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1
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
    marginTop: 20,
  },
});
