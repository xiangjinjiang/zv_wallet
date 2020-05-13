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
import {Config, i18n, ShowText} from '../../../unit/AllUnit'
import {Button} from '../../../widget/AllWidget'

export default class Page extends Component {

  render() {

    const {
      title = i18n.wallet_confirm_tx,
      info = i18n.wallet_confirm_info,
      coinName = 'ZVC',
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

      <View style={styles.bg}>

        <View style={styles.titleV}>
          <Text style={styles.topTitle}>{title}</Text>
          <TouchableOpacity onPress={onHide} style={styles.img}>
            <Image source={require('../../../img/home/pwd_close.png')}/>
          </TouchableOpacity>
        </View>

        <View style={styles.amountV}>
          <Text style={styles.amountT}>{`${value} ${coinName}`}</Text>

        </View>

        <View style={styles.textV}>
          <Text style={styles.left}>{i18n.wallet_confirm_payInfo}</Text>
          <Text style={styles.right}>{info}</Text>
        </View>

        <View style={styles.textV}>
          <Text style={styles.left}>{i18n.wallet_confirm_target}</Text>
          <Text style={styles.right}>{ShowText.addressSting(target, 10)}</Text>
        </View>

        <View style={styles.textV}>
          <Text style={styles.left}>{i18n.wallet_confirm_source}</Text>
          <Text style={styles.right}>{ShowText.addressSting(address, 10)}</Text>
        </View>

        <View style={styles.textV}>
          <Text style={styles.left}>{i18n.wallet_transfer_minerGas}</Text>
          <Text style={styles.right}>{ShowText.showZV(gas / 1e9)}
            ZVC</Text>
        </View>

        <View style={styles.flex1}/>
        <Button style={styles.button} onPress={onPress}>{i18n.wallet_add_next}</Button>
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
  flex1: {
    flex: 1
  },
  bg: {
    width: Config.width - 30,
    height: 394,
    marginLeft: 15,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  titleV: {
    alignItems: 'center',
    paddingLeft: 43,
    borderColor: '#D5D5D5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: Config.width - 30
  },
  topTitle: {
    fontSize: 15,
    color: Config.appColor,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center'
  },
  img: {
    padding: 15
  },

  amountV: {
    height: 60,
    paddingHorizontal: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  amountT: {
    fontSize: 22,
    color: Config.appColor,
    fontWeight: '600',
    textAlign:'center'
  },
  textV,
  left: {
    fontSize: 15,
    color: '#333',
    width: 110,
    paddingRight: 15,
    textAlign: 'right'
  },
  right: {
    fontSize: 13,
    color: '#999'
  },

  button: {
    marginBottom: 15,
    width: Config.width - 50
  }
})