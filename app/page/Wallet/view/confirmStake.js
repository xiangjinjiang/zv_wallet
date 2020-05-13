import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
import {Config, i18n} from '../../../unit/AllUnit'
import {Button} from '../../../widget/AllWidget'

export default class Page extends Component {

  render() {

    const {
      title = '转账确认',
      info = 'ZV转账',
      value,
      address,
      target,
      gas,
      onHide,
      onPress
    } = this.props;

    return <View style={styles.container}>
      <TouchableOpacity style={styles.flex1} onPress={onHide}>
        <View/>
      </TouchableOpacity>
      <View style={styles.content_box}>

        <View style={styles.title_box}>
          <Text style={styles.title}>{i18n.pos_redeem}</Text>
          <TouchableOpacity style={styles.closeImg} onPress={onHide}>
            <Image source={require('../../../img/wallet/icon_allpages_close.png')}></Image>
          </TouchableOpacity >
        </View>
        <Text style={styles.textFont}>
          {i18n.redeem_info1}{value + " ZVC"}{i18n.redeem_info2}
        </Text>

        <View style={styles.btnBox}>
          < TouchableOpacity onPress={onHide}>
            <Text style={styles.textBtnClose}>{i18n.my_cancel}</Text>
          </TouchableOpacity>
          < TouchableOpacity onPress={onPress}>
            <Text
              style={[
              styles.textBtnClose, {
                color: '#383276',
                margin: 30
              }
            ]}>
              {i18n.redeem_button}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
      <TouchableOpacity style={styles.flex1} onPress={onHide}>
        <View/>
      </TouchableOpacity>
    </View>
  }
}

const textV = {
  flexDirection: 'row',
  height: 54,
  paddingHorizontal: 10,
  justifyContent: "space-between",
  backgroundColor: '#fff',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderColor: Config.borderColor
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content_box: {
    width: Config.width - 30,
    height: 190,
    backgroundColor: '#fff',
    alignContent: 'center',
    borderRadius: 4,
    justifyContent: 'space-between',
    marginLeft: 15,
    alignItems: 'center'
  },
  title_box: {
    padding: 15,
    borderBottomColor: '#D5D5D5',
    position: "relative",
    borderBottomWidth: 1,
    width: Config.width - 30,
    maxHeight: 45,
    textAlign: 'center',
    alignItems: 'center'
  },
  textFont: {
    fontSize: 13,
    fontWeight: '400',
    paddingTop: 15,
    paddingHorizontal: 32,
    color: '#999999',
    lineHeight: 19
  },
  closeImg: {
    position: 'absolute',
    top: 15,
    right: 15
  },
  flex1: {
    flex: 1
  },
  bg: {
    width: Config.width - 30,
    height: 489,
    marginLeft: 15
  },
  btnBox: {
    width: Config.width - 30,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  title: {
    color: "#383276",
    fontSize: 15
  },
  textBtnClose: {
    color: '#666666',
    fontSize: 17,
    marginVertical: 30,
    fontWeight: '400'
  },
  amountV: {
    fontSize: 22,
    color: Config.appColor,
    padding: 13,
    alignSelf: 'center',
    fontWeight: '600'
  },
  textV,
  textVWithoutL: {
    ...textV,
    borderBottomWidth: 0
  },
  left: {
    fontSize: 15,
    color: '#333'
  },
  right: {
    fontSize: 13,
    color: '#999'
  },

  button: {
    marginBottom: 25,
    width: Config.width - 50
  }
})