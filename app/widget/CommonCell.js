import React, {Component} from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {Config, CoinConfig} from '../unit/AllUnit';

export default function CommonCell(props) {
  const {
    left,
    right,
    icon,
    arrow = true,
    source,
    rightImage,
    borderBottomWidth=1
  } = props
  return <View style={styles.cell}>
    <View style={[styles.view,{borderBottomWidth}]}>
      {source && <Image style={styles.titleImg} source={source}/>}
      <Text style={styles.title}>{left}</Text>
      <Text style={styles.detail}>{right}</Text>
      {rightImage != undefined && <Image source={rightImage}/>}
      {arrow && <Image style={styles.arrow} source={require('../img/my/right_arrow.png')}/>}
    </View>
  </View>
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: '#fff',
    marginHorizontal: 15
  },
  view: {
    height: 54,
    flexDirection: 'row',
    borderColor: Config.lineColor,
    alignItems: 'center'
  },
  title: {
    fontSize: 15,
    color: '#333',
    flex: 1
  },
  detail: {
    fontSize: 13,
    color: '#999'
  },
  arrow: {
    width: 8,
    height: 13,
    resizeMode: 'contain',
    marginLeft: 10
  },
  titleImg: {
    resizeMode: 'contain',
    marginRight: 8
  }

});