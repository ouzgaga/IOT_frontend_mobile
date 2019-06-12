import {
  createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator
} from 'react-navigation';
import HomeScreen from './src/screens/HomeScreen';
import LoraNodesListScreen from './src/screens/LoraNodesListScreen';
import VideoNodesListScreen from './src/screens/VideoNodesListScreen';
import NFCReaderScreen from './src/screens/NFCReaderScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SignInScreen from './src/screens/SignInScreen';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import NewLoraNodeScreen from './src/screens/NewLoraNodeScreen';
import LoraNodeStandByScreen from './src/screens/LoraNodeStandByScreen';
import NewVideoNode from './src/screens/NewVideoNodeScreen';
import NFCWriterScreen from './src/screens/NFCWriterScreen';

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  title: 'Home',
};

const LoraNodesListStack = createStackNavigator({
  Nodes: LoraNodesListScreen,
});

LoraNodesListStack.navigationOptions = {
  title: 'Lora Nodes',
};

const VideoNodesListStack = createStackNavigator({
  Nodes: VideoNodesListScreen,
});

VideoNodesListStack.navigationOptions = {
  title: 'Video Nodes',
};

const NewLoraNodeStack = createStackNavigator({
  Nodes: NewLoraNodeScreen,
});

NewLoraNodeStack.navigationOptions = {
  title: 'New Lora Node',
};

const LoraNodeStandByStack = createStackNavigator({
  Nodes: LoraNodeStandByScreen,
});

LoraNodeStandByStack.navigationOptions = {
  title: 'Lora Node stand-by',
};

const NewVideoNodeStack = createStackNavigator({
  Nodes: NewVideoNode,
});

NewVideoNodeStack.navigationOptions = {
  title: 'New Video Node',
};

const NFCReaderStack = createStackNavigator({
  NFCReader: NFCReaderScreen,
});

NFCReaderStack.navigationOptions = {
  title: 'NFC Reader',
};

const NFCWriterStack = createStackNavigator({
  NFCWriter: NFCWriterScreen,
});

NFCWriterStack.navigationOptions = {
  title: 'NFC Writer',
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  title: 'Settings',
};

const AppNavigator = createDrawerNavigator({
  HomeStack,
  LoraNodesListStack,
  VideoNodesListStack,
  NewLoraNodeStack,
  LoraNodeStandByStack,
  NewVideoNodeStack,
  NFCReaderStack,
  NFCWriterStack,
  SettingsStack,
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
