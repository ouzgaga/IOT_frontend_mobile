import React from 'react';
import { Text } from 'react-native';

export default class MonoText extends React.PureComponent {
  render() {
    const { style } = this.props;
    return <Text {...this.props} style={[style, { fontFamily: 'space-mono' }]} />;
  }
}
