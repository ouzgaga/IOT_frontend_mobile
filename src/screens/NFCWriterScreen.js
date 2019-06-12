import React from 'react';
import {
  View, Text, StyleSheet, Alert, Platform
} from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import MenuButton from '../components/MenuButton';
import SubmitButton from '../components/SubmitButton';
import Wallpaper from '../components/Wallpaper';
import UserInput from '../components/UserInputNewNode';

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([
    Ndef.textRecord(valueToWrite),
  ]);
}

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ headerTitle: <MenuButton navigation={navigation} title="NFC Writer" /> });

  constructor(props) {
    super(props);
    this.state = {
      writeMenu: false,
      textToWrite: '',
      isWriting: false,
    };

    props.navigation.addListener(
      'didBlur',
      () => {
        const { writeMenu } = this.state;
        this.stopDetection();
        if (writeMenu) {
          this.cancelNdefWrite();
        }
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

  stopDetection = () => {
    NfcManager.unregisterTagEvent()
      .then((result) => {
        console.log('unregisterTagEvent OK', result);
      })
      .catch((error) => {
        console.warn('unregisterTagEvent fail', error);
      });
  }


  writeText = async () => {
    const { textToWrite } = this.state;

    if (textToWrite === '') {
      Alert.alert(
        'Text Field empty',
        'The text to write must not be empty',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    } else {
      this.setState({ writeMenu: true });

      this.requestNdefWrite(textToWrite);
    }
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
        Alert.alert(
          'Success',
          'Congrats, writing was a success',
          [
            {
              text: 'OK',
              onPress: () => {
                this.setState({
                  writeMenu: false,
                  textToWrite: '',
                });
              }
            },
          ],
          { cancelable: false },
        );
      })
      .catch(err => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  }

  cancelNdefWrite = () => {
    this.setState({ isWriting: false });
    NfcManager.cancelNdefWrite()
      .then(() => console.log('write cancelled'))
      .catch(err => console.warn(err));
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
    } else {
      this.startDetection();
    }
  }

  render() {
    const { writeMenu } = this.state;
    return (
      <Wallpaper>

        <View style={styles.container}>

          {writeMenu ? (
            <View style={styles.container}>
              <Text style={styles.infoText}>Scan the Node to write inside</Text>
            </View>
          )
            : (
              <View style={styles.loraNodeDetails}>

                <Text style={styles.titleDetails}>Enter the text you want to write</Text>
                <UserInput
                  placeholder="Text"
                  autoCapitalize="none"
                  returnKeyType="next"
                  autoCorrect={false}
                  onChange={(v) => { this.setState({ textToWrite: v }); }}
                />
                <SubmitButton title="Submit" onPress={this.writeText} />
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
