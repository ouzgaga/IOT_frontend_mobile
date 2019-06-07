import React from 'react';
import {
  View, Text, Dimensions, TouchableOpacity, StyleSheet
} from 'react-native';

{ /* import moment from 'moment'; */ }

export default class MyListItem extends React.PureComponent {
  render() {
    const {
      id, name, description, ip
    } = this.props;
    return (
      <TouchableOpacity style={styles.menuItem} onPress={() => { }}>
        <View style={styles.nodeItem}>
          <Text style={styles.infoText}>{`ID : ${id}`}</Text>
          <Text style={styles.infoText}>{`Name : ${name}`}</Text>
          {description && <Text style={styles.infoText}>{`Description : ${description}`}</Text>}
          {ip && <Text style={styles.infoText}>{`IP : ${ip}`}</Text>}
          {/* <Text>Created At : {moment(this.props.createdAt, "YYYYMMDD").fromNow()}</Text> */}
        </View>
      </TouchableOpacity>
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
