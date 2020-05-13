import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Clipboard
} from 'react-native';
import { NavBar, EmptyComponent, Shadow, TopPadding } from '../../../widget/AllWidget'
import {
  Config,
  fullUrlRequest,
  i18n,
  Toast,
  ShowText,
  chainRequest
} from '../../../unit/AllUnit';
import WalletAction from '../../../redux/actions/WalletAction';
import HomeHeader from '../view/HomeHeader'
import ZrcAction from '../../../redux/actions/ZrcAction';
import { BigNumber } from 'bignumber.js/bignumber';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      totalSupply: ' ',
      address: ' ',
      creator: ' ',
      symbol: ' ',
      name: ' '
    };
  }

  componentWillMount() {
    const { address, decimal } = ZrcAction.selectedZrc();
    fullUrlRequest(Config.PLEDGE_HOST + '/token/findTokenDetail', {
      name: address
    }, 'GET').then(data => {
      this.setState(data)
    })
    const key = 'totalSupply';
    chainRequest({
      "method": 'Gzv_queryAccountData',
      "params": [address, key, 1]
    }).then(data => {

      if (data.result && data.result.length) {
        let value = data.result[0].value;
        this.setState({
          totalSupply: ShowText.showZV(BigNumber(value).div(Math.pow(10, decimal)), decimal)
        })
      }

    });
  }

  renderView = (left, right) => {

    return <Shadow
      top={100}
      left={100}
      source={require('../../../img/discover/bg_wakuangjiankong_all.png')}
      style={{
        width: Config.width - 14,
        height: 91 + left.length * 23,
        padding: 10,
        marginTop: 5
      }}>

      <View style={styles.titleV}>
        <Text style={styles.title}>{i18n.zrc_info}</Text>
      </View>

      <View style={styles.view}>
        <View style={styles.leftView}>
          {left.map((item, key) => {
            return <Text key={key} style={styles.leftText}>{item}</Text>
          })}
        </View>
        <View style={styles.rightView}>
          {right.map((item, key) => {
            if (item.length > 10 && (key == 3 || key == 4)) {
              return <TouchableOpacity
                style={styles.copyV}
                onPress={() => {
                  Clipboard.setString(item);
                  Toast(i18n.reload_copySuccess)
                }}>
                <Text key={key} style={styles.rightText}>{ShowText.addressSting(item, 8)}</Text>
                <Image source={require('../../../img/wallet/icon_copy.png')} />
              </TouchableOpacity>
            }
            return <Text key={key} style={styles.rightText}>{item}</Text>
          })}
        </View>
      </View>
    </Shadow>
  }

  render() {
    const { totalSupply, address, creator, symbol, name } = this.state;
    console.warn(this.state);

    return (
      <View style={styles.container}>
        <NavBar title={i18n.zrc_info} />
        <TopPadding></TopPadding>
        {
          this.renderView([
            i18n.zrc_fullName, i18n.zrc_name, i18n.zrc_initAmount, i18n.wallet_call_address, i18n.zrc_creator
          ], [
            name,
            symbol,
            totalSupply,
            address,
            creator
          ])
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  infoV: {
    width: Config.width,
    paddingHorizontal: 7,
    paddingVertical: 9,
    backgroundColor: '#272252',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  infoImg: {
    marginRight: 9
  },
  infoT: {
    fontSize: 13,
    color: '#fff'
  },
  scrollV: {
    alignItems: 'center'
  },
  titleV: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    marginTop: 8
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  groupName: {
    fontSize: 14,
    color: Config.appColor,
    fontWeight: '500',
    marginLeft: 15,
    flex: 1
  },
  view: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 15
  },
  leftView: {
    alignItems: 'flex-end'
  },
  rightView: {
    flex: 1
  },
  leftText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 23,
    marginRight: 15
  },
  rightText: {
    fontSize: 12,
    color: '#999',
    lineHeight: 23
  },
  activedText: {
    fontSize: 12,
    color: Config.appColor,
    fontWeight: '500',
    lineHeight: 23
  },
  copyV: {
    height: 23,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  endBlock: {
    fontSize: 13,
    color: '#999',
    paddingHorizontal: 15
  },

  bannerImg: {
    height: 73,
    width: Config.width - 30,
    resizeMode: 'stretch',
    margin: 15
  },
  adText: {
    margin: 15,
    marginBottom: 10,
    fontSize: 15,
    color: '#fff',
    fontWeight: '500'
  },
  adGoV: {
    marginLeft: 15,
    flexDirection: 'row',
    paddingHorizontal: 11,
    paddingVertical: 3.5,
    borderRadius: 9,
    backgroundColor: '#F1C073'
  },
  adGoText: {
    fontSize: 11,
    color: '#fff'
  },
  row: {
    flexDirection: 'row'
  }
});