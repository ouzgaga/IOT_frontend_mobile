import React from 'react';
import { FlatList } from 'react-native';
import MenuButton from '../components/MenuButton';
import LoraNodesAPI from '../api/LoraNodesAPI';
import Wallpaper from '../components/Wallpaper';
import NodeItem from '../components/NodeItem';
import Loader from '../components/Loader';

export default class LoraNodesListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({ headerTitle: <MenuButton navigation={navigation} title="Lora nodes" /> });

  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
      loading: false,
    };

    props.navigation.addListener(
      'didFocus',
      () => { this.fetchDatas(); }
    );
  }

  fetchDatas = async () => {
    this.setState({ loading: true });
    const nodes = await LoraNodesAPI.fetchAllLoraNodes();
    this.setState({ nodes, loading: false });
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
