import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Linking,
  Clipboard
} from 'react-native';
import {NavBar, ScrollTab, Button, InputWithAnimate, Loading} from '../../../widget/AllWidget'
import {
  Config,
  chainRequest,
  Toast,
  ShowText,
  fullUrlRequest,
  i18n,
  TxManager
} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import ImageCapInset from 'react-native-image-capinsets';
import {BigNumber} from 'bignumber.js/bignumber';

export default class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      "createdAt": "",
      "source": "",
      "target": "",
      "txHash": "",
      "value": '',
      blockHeight: ''
    }
    const params = this.props.navigation.state.params;
    this.id = params.id;
    this.coinName = ` ${params.coinName}`
    this.decimal = params.decimal;
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    fullUrlRequest(Config.PLEDGE_HOST + '/token/transactionDetail', {
      id: this.id
    }, 'GET').then(data => {
      this.setState(data)
    })
  }

  copyString = string => {
    Clipboard.setString(string);
    Toast(i18n.reload_copySuccess)
  }

  render() {
    const {source, target, txHash, value, blockHeight} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <NavBar
            title={i18n.wallet_tx_detail}
            color='#fff'
            backgroundColor='rgba(0,0,0,0)'></NavBar>
          <View style={{
            flex: 1
          }}>
            <View style={{
              position: "relative"
            }}>
              <Image
                style={styles.topBg}
                source
                ={require('../../../img/wallet/img_jiaoyixiangqingBg.png')}></Image>
              <Image
                style={{
                marginTop: -120,
                marginBottom: 26,
                alignSelf: 'center'
              }}
                source={require('../../../img/wallet/icon_success.png')}></Image>
            </View>
            <View style={{
              flex: 1
            }}>

              <ImageCapInset
                style={styles.connectBox}
                capInsets={{
                top: 120,
                right: 120,
                bottom: 120,
                left: 20
              }}
                resizeMode='stretch'
                source={require('../../../img/zrc/token_tx_bg.png')}>
                <View style={styles.content_box}>
                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_payInfo}</Text>
                    <Text numberOfLines={1} style={styles.inputValue}>{i18n.wallet_tx_type0}</Text>
                  </View>

                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_target}</Text>
                    <Text
                      numberOfLines={2}
                      style={styles.inputValue}
                      onPress={() => this.copyString(target)}>{target}</Text>
                  </View>

                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_source}</Text>
                    <Text
                      numberOfLines={2}
                      style={styles.inputValue}
                      onPress={() => this.copyString(source)}>{source}</Text>
                  </View>
                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_value}</Text>
                    <Text numberOfLines={1} style={styles.inputValue}>{ShowText.showZV(BigNumber(value).div(Math.pow(10, this.decimal)), this.decimal) + this.coinName}</Text>
                  </View>

                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_hash}</Text>
                    <Text
                      numberOfLines={2}
                      style={styles.inputValue}
                      onPress={() => this.copyString(txHash)}>{txHash}</Text>
                  </View>
                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_height}</Text>
                    <Text style={styles.inputValue}>{blockHeight}</Text>
                  </View>

                </View>
                <View
                  style={{
                  overflow: 'hidden',
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  width: Config.width - 31,
                  minHeight: 40,
                  padding: 10,
                  backgroundColor: '#383276'
                }}>
                  <Text
                    style={{
                    flex: 1,
                    fontSize: 13,
                    color: '#fff',
                    fontWeight: '400'
                  }}
                    onPress={() => {
                    Linking.openURL(`https://explorer.zvchain.io/?${ (new Date).getTime()}#/${Config.WEB_KEY}/tx/${txHash}`)
                  }}>{i18n.wallet_tx_toWeb}</Text>
                </View>
              </ImageCapInset>
            </View>

          </View>
        </ScrollView>
        {this.state.showLoading && <Loading showLoading={true}></Loading>}
      </View>
    )
  }

};

const topBgHeight = Config.width / 375 * 214;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.bgColor
  },
  topBg: {
    width: Config.width,
    height: topBgHeight,
    resizeMode: 'contain',
    marginTop: -Config.navBarHeight - 2
  },
  connectBox: {
    // marginTop: -26,
    alignSelf: 'center',
    alignItems: "center",
    width: Config.width - 16,
    height: 466
  },
  content_box: {
    paddingTop: 5,
    paddingBottom: 3,
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8
  },
  dataList: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: "hidden",
    width: Config.width - 30,
    height: 54,
    borderColor: '#D5D5D5',
    borderBottomWidth: 1,
    // borderStyle:"solid"
  },

  itemTitle: {
    // marginLeft: 10,
    paddingRight: 15,
    width: 85,
    textAlign: 'right',
    fontSize: 15,
    fontWeight: "400"
  },
  inputValue: {
    fontSize: 13,
    flex: 1,
    fontWeight: '400',
    color: '#999999',
    marginRight: 10
  },
  noteBox: {
    overflow: "hidden",
    backgroundColor: '#EBEBF2',
    color: '#333',
    borderRadius: 4,
    borderWidth: 1,
    maxHeight: 40,
    borderColor: '#D5D5D5',
    minHeight: 40,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  }
})