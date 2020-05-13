import React, {Component} from 'react';
import {StyleSheet, Text, Image, View} from 'react-native';
import {Config, i18n} from '../unit/AllUnit'

const no_list = require('../img/home/no_list.png')
const no_data = require('../img/home/no_data.png')
const no_group = require('../img/discover/no_group.png')
const allNoImg = {
  no_list,
  no_data,
  no_group
}

export default class Space extends Component {

  render() {

    let {
      text,
      img,
      hide,
      justifyContent = 'center',
      paddingTop = 50,
      minHeight = 150
    } = this.props
    if (hide) 
      return <View style={{
        height: minHeight
      }}></View>
    if (!text) 
      text = i18n.no_data
    img = allNoImg[img] || no_list

    return (
      <View
        style={[
        styles.view, {
          justifyContent,
          paddingTop
        }
      ]}>
        <Image style={styles.imgstyle} source={img}/>
        <Text style={styles.text}>{text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)'
  },

  imgstyle: {},

  text: {
    color: '#666',
    fontSize: 14,
    padding: 20,
    marginTop: -40
  }

})
