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
import {Config, i18n, NavigationService} from '../../../unit/AllUnit'
import {Button} from '../../../widget/AllWidget'

export default class Page extends Component {

  render() {
    const {isShow, onHide} = this.props;
    if (!isShow) {
      return null;
    }

    const data = [
      {
        title: i18n.wallet_network,
        pushTo: 'SwitchNetwork',
        img: require('../../../img/wallet/icon_exchange_wifi.png')
      }, {
        title: i18n.wallet_account,
        pushTo: 'WalletSwitch',
        img: require('../../../img/wallet/icon_exchange_wallet.png')
      }
    ];

    return (

      <TouchableOpacity
        style={[
        styles.container, {
          display: isShow
            ? 'flex'
            : 'none'
        }
      ]}
        onPress={onHide}>

        <View>
          <View style={styles.poptipBox}>
            {data.map((item, k) => {
              return <TouchableOpacity
                key={k}
                style={[
                styles.itemList, {
                  borderBottomWidth: k < data.length - 1
                    ? 1
                    : 0
                }
              ]}
                onPress={() => {
                NavigationService.navigate(item.pushTo);
                onHide()
              }}>
                <Image source={item.img}></Image>
                <Text style={styles.text}>{item.title}</Text>
              </TouchableOpacity>
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.flex1} onPress={onHide}>
          <View/>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1,1,1,0.5)',
    zIndex: 999,
    flex: 1
  },
  poptipBox: {
    borderRadius: 4,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
    marginTop: Config.navBarHeight - 10,
    marginRight: 15,
    paddingBottom: 5
  },
  itemList: {
    flexDirection: "row",
    alignItems: 'center',
    paddingLeft: 10,
    borderColor: Config.lineColor,
    borderBottomWidth: 1,
    height: 37
  },
  text: {
    color: '#666',
    fontSize: 14,
    padding: 7
  },
  flex1: {
    flex: 1
  }
})