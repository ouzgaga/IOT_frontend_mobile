import React from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Alert } from 'react-native';
import MenuButton from '../components/MenuButton';
import SubmitButton from '../components/SubmitButton';
import Wallpaper from '../components/Wallpaper';

import NfcManager, { Ndef } from 'react-native-nfc-manager';
import UserInput from '../components/UserInputNewNode'
import LoraNodesAPI from '../api/LoraNodesAPI'
import storageManager from '../utils/StorageManager';
import Util from '../utils/Util';

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([
    Ndef.textRecord(valueToWrite),
  ]);
}

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: <MenuButton navigation={navigation} title="New Lora Node" /> }
  };

  constructor(props) {
    super(props);
    this.state = {
      token: '',
      supported: true,
      enabled: false,
      tag: {},
      parsedText: null,
      loading: false,
      videoNodeName: '',
      videoNameDescription: '',
      detectionNFC: false,
      isWriting: false,
      NFCReadText: false,
      nodeUID: null,
    };

    props.navigation.addListener(
      'didBlur',
      () => {
        this._stopDetection();
      }
    );
    props.navigation.addListener(
      'didFocus',
      () => {
        NfcManager.isSupported()
          .then(supported => {
            this.setState({ supported });
            if (supported) {
              this._startNfc();
            }
          });
      }
    );
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    const userToken = await storageManager.getToken();
    this.setState({ token: userToken })
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
          this._startDetection();
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

  _startDetection = () => {
    NfcManager.registerTagEvent(this._onTagDiscovered)
      .then(result => {
        console.log('registerTagEvent OK', result)
      })
      .catch(error => {
        console.warn('registerTagEvent fail', error)
      })
  }


  _onTagDiscovered = tag => {

    let text = this._parseText(tag);

    // TODO : voir format des données lues par NFC

      this.setState({ nodeUID: text })
      this.setState({ NFCReadText: text });
    
  }

  _stopDetection = () => {
    NfcManager.unregisterTagEvent()
      .then(result => {
        console.log('unregisterTagEvent OK', result)
      })
      .catch(error => {
        console.warn('unregisterTagEvent fail', error)
      })
  }

  _parseText = (tag) => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  fetchNameExisting = async () => {
    const { videoNodeName, videoNameDescription, token, nodeUID, nodepublicKey } = this.state;

    if (videoNodeName === '' || videoNameDescription === '') {
      Alert.alert(
        'Text Fields empty',
        'The name and the description must not be empty',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
      );
    } else {
      this.setState({
        detectionNFC: true
      });
    }

    console.log(videoNodeName, videoNameDescription, nodeUID)
    const response = await LoraNodesAPI.addLoraNode(videoNodeName, videoNameDescription, nodeUID)

    console.log('response 2', response)

    // TODO : voir la structure des données, ici données séparée par un ';'
    const infosToWrite = `${nodeUID}`;

    this._requestNdefWrite(infosToWrite)
  }

  _parseText = (tag) => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  render() {
    const { detectionNFC, NFCReadText } = this.state;
    return (
      <Wallpaper>

        <View style={styles.container}>

          {NFCReadText ? (
            detectionNFC ? (
              <View style={styles.container}>
                <Text style={styles.infoText}>Scan the Node to write inside</Text>
              </View>
            ) : (
                <View style={styles.videoNodeDetails}>

                  <Text style={styles.titleDetails}>Enter video Node name and description</Text>
                  <UserInput
                    placeholder="Name"
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    autoCorrect={false}
                    onChange={(v) => { this.setState({ videoNodeName: v }); }}
                  />

                  <UserInput
                    placeholder="Description"
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    autoCorrect={false}
                    onChange={(v) => { this.setState({ videoNameDescription: v }); }}
                  />

                  <SubmitButton title="Submit" isLoading={this.state.loading} onPress={this.fetchNameExisting} />
                </View>
              )
          ) : (
              <Text style={styles.infoText}>Scan the Lora Node to register it</Text>
            )
          }
        </View>
      </Wallpaper>

    );
  }

  _requestNdefWrite = (text) => {
    let { isWriting } = this.state;
    if (isWriting) {
      return;
    }

    const bytes = buildTextPayload(text);

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(bytes)
      .then(() => {
        this._cancelNdefWrite();
        
        Alert.alert(
          'New device',
          'Congrats, the node has been registred',
          [
            {
              text: 'OK', onPress: () => {

                this.setState({
                  vidoeNodeName: '',
                  videoNameDescription: '',
                  detectionNFC: false,
                  NFCReadText: null,
                  nodeUID: null,
                })
              }
            },
          ],
        )
      })
      .catch(err => console.warn(err))
  }

  _cancelNdefWrite = () => {
    this.setState({ isWriting: false });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoNodeDetails: {
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
