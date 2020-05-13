import React, {Component} from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {Config, i18n} from '../../../unit/AllUnit';

export default function HomeHeader(props) {
  const {title, getMorePress} = props
  return <View style={styles.accountHeader}>
    <View style={styles.redBlock}/>
    <Text style={styles.headerText}>{title}</Text>
    {getMorePress && <TouchableOpacity onPress={getMorePress} style={styles.row}>
      <Text style={styles.getMore}>{i18n.home_getMore}</Text>
      <Image source={require('../../../img/home/icon_more.png')}/>
    </TouchableOpacity>
}
  </View>
}

const styles = StyleSheet.create({

  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },
  redBlock: {
    width: 3,
    height: 12,
    marginRight: 10,
    backgroundColor: Config.appColor
  },
  headerText: {
    color: '#333',
    fontSize: 13,
    flex: 1,
    fontWeight: 'bold'
  },
  accountText: {
    color: '#333',
    fontSize: 14
  },
  getMore: {
    fontSize: 12,
    color: '#999',
    paddingVertical: 15,
    // flexDirection: 'row-reverse'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});