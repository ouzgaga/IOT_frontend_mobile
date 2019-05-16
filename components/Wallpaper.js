import React, {Component} from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import bgSrc from '../assets/images/wallpaper.png';

export default class Wallpaper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground style={styles.wallpaper} source={bgSrc}>
        {this.props.children}
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