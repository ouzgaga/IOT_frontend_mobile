import React from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Alert } from 'react-native';
import MenuButton from '../navigation/MenuButton';
import SubmitButton from '../components/SubmitButton';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import UserInput from '../components/UserInputNewNode'

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
      loraNodeName: '',
      loraNameDescription: '',
      detectionNFC: false,
      isWriting: false,
      UIDDetected: null,
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

    this.setState({ tag });

    let text = this._parseText(tag);

    this.setState({ UIDDetected: text });

    /*
    fetch('https://mywebsite.com/endpoint/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),
    }).then(response => response.json())
    .then(responseJson => console.log(responseJson)); */

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

  fetchNameExisting = () => {
    const { loraNodeName, loraNameDescription } = this.state;

    if (loraNodeName === '' || loraNameDescription === '') {
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
    this._requestNdefWrite(this.state.loraNodeName)

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
    const { tag, parsedText, detectionNFC, UIDDetected } = this.state;

    console.log(UIDDetected)
    return (
      <View style={styles.container}>

        {UIDDetected ? (
          detectionNFC ? (
            <View style={styles.container}>
              <Text>Scan the Node to write inside</Text>
            </View>
          ) : (
              <View style={styles.loraNodeDetails}>

                <Text>{`UID : ${UIDDetected}`}</Text>

                <Text style={styles.titleDetails}>Enter Lora Node name and description</Text>
                <UserInput
                  placeholder="Name"
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  autoCorrect={false}
                  onChange={(v) => { this.setState({ loraNodeName: v }); }}
                />

                <UserInput
                  placeholder="Description"
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  autoCorrect={false}
                  onChange={(v) => { this.setState({ loraNameDescription: v }); }}
                />

                <SubmitButton title="Submit" isLoading={this.state.loading} onPress={this.fetchNameExisting} />
              </View>
            )
        ) : (
            <Text>Scan the Lora Node to register it</Text>
          )
        }
      </View>
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
                  loraNodeName: '',
                  loraNameDescription: '',
                  detectionNFC: false,
                  UIDDetected: null,
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
    backgroundColor: '#F5FCFF',
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
    fontSize: 18,
    marginTop: 30,
    marginBottom: 30,
  }
});
