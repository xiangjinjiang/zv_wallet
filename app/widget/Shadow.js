import React, {Component} from 'react'
import ImageCapInset from 'react-native-image-capinsets';

export default class VideoCell extends Component {
  render() {

    const {
      source = require('../img/wallet/shadow.png'),
      top = 30,
      right= 30,
      bottom=30,
      left= 30
    } = this.props;

    return (
      <ImageCapInset
        style={this.props.style}
        capInsets={{
        top,
        right,
        bottom,
        left
      }}
        resizeMode='stretch'
        source={source}>
        {this.props.children}
      </ImageCapInset>
    )
  }
}