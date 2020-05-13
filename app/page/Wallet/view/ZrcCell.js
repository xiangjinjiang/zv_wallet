import React, {Component} from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {Config, ShowText, NavigationService} from '../../../unit/AllUnit';
import {Shadow} from '../../../widget/AllWidget';
import ZrcAction from '../../../redux/actions/ZrcAction';

const icon_jifen_delete = require('../../../img/zrc/icon_jifen_delete.png');
const icon_jifen_updown = require('../../../img/zrc/icon_jifen_updown.png');
const img_token = require('../../../img/zrc/icon_alljifen.png');
const icon_jifen_add = require('../../../img/zrc/icon_jifen_add.png');

export default function Cell(props) {

  const {
    isSearch,
    isEdit,
    item,
    onDelete,
    onAdd,
    onToTop
  } = props;
  const {address, value, name, decimal, pic} = item;
  let isShowAdd = false;
  if (isSearch) {
    isShowAdd = ZrcAction.isShowAdd(item);
  }

  //
  const titleStyle = {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    paddingVertical: 2
  };
  const valueStyle = {
    fontSize: 15,
    color: Config.appColor,
    fontWeight: '500',
    marginRight: 2
  };

  if (Config.isAndroid) {
    titleStyle.fontFamily = 'Robot'
    valueStyle.fontFamily = 'Robot'
  }

  let zrc_img = pic ? {uri:pic} : img_token

  return <Shadow style={styles.bg}>
    <View style={styles.cell}>
      {isEdit && <TouchableOpacity onPress={onDelete}>
        <Image style={styles.leftImg} source={icon_jifen_delete}/>
      </TouchableOpacity>}
      <Image style={styles.logo} source={zrc_img}/>
      <View style={styles.textV}>
        <Text style={titleStyle}>{name}</Text>
        {isSearch && <Text style={styles.address} numberOfLines={1}>{address}</Text>}
      </View>
      {!isSearch && <Text style={valueStyle}>{ShowText.showZV(value, decimal)}</Text>}
      {isShowAdd && <TouchableOpacity onPress={onAdd}>
        <Image style={styles.rightImg} source={icon_jifen_add}/>
      </TouchableOpacity>}
      {isEdit && <TouchableOpacity onPress={onToTop}>
        <Image style={styles.rightImg} source={icon_jifen_updown}/>
      </TouchableOpacity>}

    </View>

  </Shadow>
}
const styles = StyleSheet.create({
  bg: {
    width: Config.width - 16,
    height: 74,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -5
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Config.width - 30,
    flex: 1,
    padding: 10
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 10
  },
  textV: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10
  },

  address: {
    fontSize: 13,
    color: '#999',
    paddingVertical: 2
  },

  leftImg: {
    margin: 10,
    marginLeft: 0

  },
  rightImg: {
    margin: 10,
    marginRight: 0
  }
});