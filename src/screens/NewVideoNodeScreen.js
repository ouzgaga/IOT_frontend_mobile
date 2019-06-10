import React from 'react';
import {
  View, Text, StyleSheet, Platform, Alert
} from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';

import MenuButton from '../components/MenuButton';
import SubmitButton from '../components/SubmitButton';
import Wallpaper from '../components/Wallpaper';

import UserInput from '../components/UserInputNewNode';
import VideoNodesAPI from '../api/VideoNodesAPI';
import storageManager from '../utils/StorageManager';
import Loader from '../components/Loader';

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([
    Ndef.textRecord(valueToWrite),
  ]);
}

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ headerTitle: <MenuButton navigation={navigation} title="New Video Node" /> });

  constructor(props) {
    super(props);
    this.state = {
      token: '',
      loading: false,
      videoNodeName: '',
      videoNameDescription: '',
      detectionNFC: false,
      isWriting: false,
      nodeIP: null,
      nodepublicKey: null,
      NFCReadText: false,
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

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    const userToken = await storageManager.getToken();
    this.setState({ token: userToken });
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

    // TODO : voir format des données lues par NFC, ici : séparée par un ;
    const nodeInfos = text.split(';');

    if (nodeInfos[0] && nodeInfos[1]) {
      this.setState({ nodeIP: nodeInfos[0] });
      this.setState({ nodepublicKey: nodeInfos[1] });
      this.setState({ NFCReadText: text });
    }
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

  fetchNameExisting = async () => {
    const {
      videoNodeName, videoNameDescription, token, nodeIP, nodepublicKey
    } = this.state;

    if (videoNodeName === '' || videoNameDescription === '') {
      Alert.alert(
        'Text Fields empty',
        'The name and the description must not be empty',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    } else {
      this.setState({
        detectionNFC: true
      });
    }

    this.setState({ loading: true });

    const response = await VideoNodesAPI.addVideoNode(token, videoNodeName, videoNameDescription, nodeIP, nodepublicKey);

    this.setState({ loading: false });

    if (response.statusCode === 400) {
      Alert.alert(
        'Bad Request',
        'The request has failed',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    } else {
      const serverPublicKey = response.publicKey;

      // TODO : voir la structure des données, ici données séparée par un ';'
      const infosToWrite = `${nodeIP};${nodepublicKey};${serverPublicKey}`;

      this.requestNdefWrite(infosToWrite);
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
        this.cancelNdefWrite();

        // TODO : permet de lancer le peering entre le back-end et le noeud Video
        // Décommenter la ligne ci-dessus quand le noeud Video sera prêt à faire le peering
        // VideoNodesAPI.runVideoNode(token, nodeIP);
        Alert.alert(
          'New device',
          'Congrats, the node has been registred',
          [
            {
              text: 'OK',
              onPress: () => {
                this.setState({
                  videoNodeName: '',
                  videoNameDescription: '',
                  detectionNFC: false,
                  NFCReadText: null,
                  nodeIP: null,
                  nodepublicKey: null,
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
    } else {
      this.startDetection();
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
                <View style={styles.videoNodeDetails}>

                  <Text style={styles.titleDetails}>Enter video Node name and description</Text>
                  <UserInput
                    placeholder="Name"
                    autoCapitalize="none"
                    returnKeyType="next"
                    autoCorrect={false}
                    onChange={(v) => { this.setState({ videoNodeName: v }); }}
                  />

                  <UserInput
                    placeholder="Description"
                    autoCapitalize="none"
                    returnKeyType="next"
                    autoCorrect={false}
                    onChange={(v) => { this.setState({ videoNameDescription: v }); }}
                  />

                  <SubmitButton title="Submit" isLoading={loading} onPress={this.fetchNameExisting} />
                </View>
              )
          )
            : (
              <Text style={styles.infoText}>Scan the Video Node to register it</Text>
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
