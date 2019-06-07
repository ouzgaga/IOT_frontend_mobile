import React from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Alert } from 'react-native';
import MenuButton from '../components/MenuButton';
import SubmitButton from '../components/SubmitButton';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import UserInput from '../components/UserInputNewNode'
import Wallpaper from '../components/Wallpaper';

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([
    Ndef.textRecord(valueToWrite),
  ]);
}

export default class LoraNodeStandByScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: <MenuButton navigation={navigation} title="Lora Node stand-by" /> }
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
      loraNodeName: '',
      loraNameDescription: '',
      detectionNFC: false,
      isWriting: false,
      UIDDetected: null,
      changeStateLoraNode: false,
      nodeIsActive: null,
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
    this.setState({ UIDDetected: text });

    // TODO : fetch au backend pour savoir si le noeud Lora est en stand-by ou non
    const isActive = true; // noeud en stand-by ou non
    this.setState({
      isActive
    })
    if (isActive) {
      Alert.alert(
        `Node ${isActive ? 'active' : 'inactive'}`,
        `The node is ${isActive ? 'active' : 'inactive'}, do you you to ${isActive ? 'desactive' : 'active'} it`,
        [
          {
            text: 'NO', onPress: () => {
              this.setState({
                UIDDetected: null,
              });
            }
          },
          {
            text: 'YES', onPress: () => {
              this._requestNdefWrite(isActive ? 'desactive' : 'active')
            }
          },
        ],
        {cancelable: false},
      )
    }

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
    const { isActive, UIDDetected } = this.state;

    return (
      <Wallpaper>
        <View style={styles.container}>

          {UIDDetected ? (
            <Text style={styles.infoText}>{`Scan the Lora Node to ${isActive ? 'desactive' : 'active'} it`}</Text>
          ) : (
              <Text style={styles.infoText}>Scan the Lora Node</Text>
            )
          }
        </View>
      </Wallpaper>
    );
  }

  _requestNdefWrite = (text) => {
    let { isWriting, isActive } = this.state;
    if (isWriting) {
      return;
    }

    const bytes = buildTextPayload(text);

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(bytes)
      .then(() => {
        this._cancelNdefWrite();
        Alert.alert(
          'Device changed',
          `Congrats, the node has been ${isActive ? 'desactived' : 'actived'}`,
          [
            {
              text: 'OK', onPress: () => {

                this.setState({
                  UIDDetected: null,
                });
              }
            },
          ],
          {cancelable: false},
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
    marginTop: 30,
    marginBottom: 30,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
});
