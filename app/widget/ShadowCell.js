import React, {Component} from 'react'
import ImageCapInset from 'react-native-image-capinsets';
import { Config } from '../unit/AllUnit';
import {View} from 'react-native';

export default class ShadowCell extends Component {
  render() {

    const {
      source = require('../img/wallet/shadow.png'),
      top = 10,
      right = 10,
      bottom = 10,
      left = 10,
      style = {},
      children,
      marginTop=10,
      marginBottom=0,
    } = this.props;
    const { width = Config.width - 30,
      height = 80 } = style;
    
    const sideOffset = 7
    const shadowStyle = {
      width: width + sideOffset *2,
      height: height + sideOffset * 2,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: marginTop - sideOffset,
      marginBottom: marginBottom-sideOffset,
      marginLeft: -sideOffset,
      marginRight:-sideOffset,
      padding:sideOffset
    }

    return (
      <ImageCapInset
        style={shadowStyle}
        capInsets={{
        top,
        right,
        bottom,
        left
      }}
        resizeMode='stretch'
        source={source}>
        <View style={style}>
        {children}

        </View>

      </ImageCapInset>
    )
  }
}