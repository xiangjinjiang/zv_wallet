import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import {Config} from '../unit/AllUnit'

const shadowOpt = {
  // width: Config.width - 10, height: 90,
  color: "#C8C8C8",
  border: 5,
  // radius: 3,
  opacity: 0.5,
  x: 0,
  y: 1,
  style: {
    // marginVertical: 1
  },
  side: "bottom"
}

export default class VideoCell extends Component {
  render() {
    shadowOpt.style = {
      backgroundColor: '#fff',
      // marginVertical: 2,
      ...this.props.style
    }
    const style = {
      ...shadowOpt,
      ...this.props.style
    }

    return (
      <View
        setting={style}
        style={{
        flexDirection: 'row',
        alignContent: 'center',
        padding: 20
      }}>
        {this.props.children}
      </View>
    )
  }
}