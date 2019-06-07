import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class MenuButton extends React.PureComponent {
  render() {
    const { navigation, title } = this.props;
    return (
      <View style={styles.menuHeader}>
        <Icon name="md-menu" size={32} onPress={navigation.toggleDrawer} />
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        >
          <Text style={styles.textHeader}>{title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuHeader: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 50
  }
});
