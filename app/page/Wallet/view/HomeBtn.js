import React, {Component} from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {Config, CoinConfig} from '../../../unit/AllUnit';

export default function HomeBtn(props) {
  const {title, img, backgroundColor, onPress} = props;

  return <TouchableOpacity style={styles.btn} onPress={() => onPress()}>
    <View style={[styles.imgBg, {
        backgroundColor
      }]}>
      <Image style={styles.btnImage} source={img}/>
    </View>
    <Text style={styles.btnText}>{title}</Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  imgBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  btnText: {
    paddingTop: 10,
    color: '#333',
    fontSize: 15,
    textAlign: 'center'
  }
});