import React, {Component} from 'react';
import {Text} from 'react-native';
import {Config} from '../unit/AllUnit';
export default render = (props) => {
  const {
    style = {},
    children
  } = props;
  let textStyle = {
    ...style,
    fontWeight:'500'
  }
  if (Config.isAndroid) {
    textStyle.fontFamily = 'Robot';
  }
  return <Text style={textStyle}>{children}</Text>
}