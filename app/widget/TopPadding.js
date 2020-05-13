import React, {V} from 'react';
import {View} from 'react-native';
import {Config} from '../unit/AllUnit'

export default render = (props) => {
  const {
    height = 10,
    width = Config.width
  } = props
  return <View style={{
    height,
    width,
    backgroundColor: Config.bgColor
  }}/>
}