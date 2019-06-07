import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MenuButton from '../components/MenuButton';
//import nodes from '../assets/utils/nodes'
import moment from 'moment';
import VideoNodesAPI from '../api/VideoNodesAPI'
import storageManager from '../utils/StorageManager';
import Wallpaper from '../components/Wallpaper';

class MyListItem extends React.PureComponent {

  render() {
    const textColor = 'black';
    const { id, name, description, ip } = this.props;
    return (
      <TouchableOpacity style={styles.menuItem} onPress={() => { }}>
        <View style={styles.nodeItem}>
          <Text style={styles.infoText}>{`ID : ${id}`}</Text>
          <Text style={styles.infoText}>{`Name : ${name}`}</Text>
          <Text style={styles.infoText}>{`Description : ${description}`}</Text>
          <Text style={styles.infoText}>{`IP : ${ip}`}</Text>
          {/*<Text>Created At : {moment(this.props.createdAt, "YYYYMMDD").fromNow()}</Text>*/}
        </View>
      </TouchableOpacity>
    );
  }
}


export default class VideoNodesListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { headerTitle: <MenuButton navigation={navigation} title="Video nodes" /> }
  };

  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
    }

    props.navigation.addListener(
      'didFocus',
      () => { this.fetchDatas() }
    );
  }

  fetchDatas = async () => {
    const userToken = await storageManager.getToken();
    const nodes = await VideoNodesAPI.fetchAllVideoNodes(userToken);
    if(nodes) {
      this.setState({ nodes })
    }
  }

  _keyExtractor = (item, index) => item.id;


  _renderItem = ({ item }) => (
    <MyListItem
      id={item.id}
      name={item.name}
      description={item.description}
      ip={item.ip}
    />
  );

  render() {
    const { nodes } = this.state;
    return (
      <Wallpaper>
        <FlatList
          data={nodes}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </Wallpaper>
    );
  }
}

const styles = StyleSheet.create({
  menuItem: {
    width: Dimensions.get('window').width,
    borderTopWidth: 1,
  },
  nodeItem: {
    padding: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
});
