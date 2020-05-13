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
  }
  if (!textStyle.lineHeight && textStyle.fontSize) {
    textStyle.lineHeight = textStyle.fontSize*1.5;
  }
  return <Text style={textStyle}>{children}</Text>
}