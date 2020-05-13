import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Config} from '../unit/AllUnit'

export default class Page extends Component {

  onPress = () => {
    this.props.onPress && this
      .props
      .onPress()
  }

  render() {
    let {source, size, width, height, style} = this.props
    if (size) {
      width = size
      height = size
    } 

    style = {
      width,
      height,
      resizeMode: "center",
      ...style
    }

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Image source={source} style={style}></Image>
      </TouchableOpacity>
    )
  }

}
