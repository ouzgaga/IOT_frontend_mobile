import React from 'react';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MenuButton from '../components/MenuButton';
import VideoNodesAPI from '../api/VideoNodesAPI';
import Wallpaper from '../components/Wallpaper';
import NodeItem from '../components/NodeItem';
import Loader from '../components/Loader';

export default class VideoNodesListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ headerTitle: <MenuButton navigation={navigation} title="Video nodes" /> });

  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
    };

    props.navigation.addListener(
      'didFocus',
      () => { this.fetchDatas(); }
    );
  }

  fetchDatas = async () => {
    const userToken = await AsyncStorage.getItem('token');
    this.setState({ loading: true });
    const nodes = await VideoNodesAPI.fetchAllVideoNodes(userToken);
    if (nodes) {
      this.setState({ nodes });
    }
    this.setState({ loading: false });
  }

  keyExtractor = item => item.id;


  renderItem = ({ item }) => (
    <NodeItem
      id={item.id}
      name={item.name}
      description={item.description}
      ip={item.ip}
    />
  );

  render() {
    const { nodes, loading } = this.state;
    return (
      <Wallpaper>
        <Loader visible={loading} />

        <FlatList
          data={nodes}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </Wallpaper>
    );
  }
}
