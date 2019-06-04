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

  constructor() {
    super();
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
    };
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
    this.setState({ parsedText: text });

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

    this._requestNdefWrite('yoo3')
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

      this._startDetection();
    }
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
    const { tag, parsedText, detectionNFC } = this.state;

    return (
      <View style={styles.container}>
        {detectionNFC ? (
          <View style={styles.container}>

            <Text>Scan the Lora Node</Text>
            <Text>Stay on the Node</Text>

            <Text>{parsedText}</Text>

          </View>

        ) : (
            <View style={styles.container}>
              <Text>Details</Text>
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
          )}


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
      .then(() => Alert.alert(
        'New device',
        'Congrats, the node has been registred',
        [
          { text: 'OK', onPress: () => { this._stopDetection(); this._cancelNdefWrite(); this.setState({ loraNodeName: '',
          loraNameDescription: '',
          detectionNFC: false,}) } },
        ],
      ))
      .catch(err => console.warn(err))
      .then(() => { this._cancelNdefWrite(); this.setState({ isWriting: false }) });
  }

  _cancelNdefWrite = () => {
    this.setState({ isWriting: false });
    NfcManager.cancelNdefWrite()
      .then(() => console.log('write cancelled'))
      .catch(err => console.warn(err))
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  nameTextInput: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1
  }
});
