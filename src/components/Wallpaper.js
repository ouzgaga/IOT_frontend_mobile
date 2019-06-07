import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import bgSrc from '../assets/images/wallpaper.png';

export default class Wallpaper extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <ImageBackground style={styles.wallpaper} source={bgSrc}>
        {children}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wallpaper: {
    flex: 1,
    flexDirection: 'column',
    resizeMode: 'cover',
  },
});
