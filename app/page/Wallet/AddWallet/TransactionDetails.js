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
const statusObj = { // todo 未知type 祥ConsValue.js
  0: i18n.wallet_tx_type0,
  1: i18n.wallet_tx_type1,
  2: i18n.wallet_tx_type2,
  3: i18n.wallet_tx_type3,
  4: '',
  5: i18n.wallet_tx_type5,
  6: i18n.wallet_tx_type6
}
export default class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Transaction: {
        type: ''
      },
      Receipt: {},
      td: {},
      showLoading: true
    }
    if (this.props.navigation.state.params) {
      this.hash = this.props.navigation.state.params.hash;
      this.key = this.props.navigation.state.params.key
    }
  }

  componentDidMount = () => {
    this.getTransactionDetails();
  };
  componentWillUnmount = () => {
    this.unmount = true;

  }
  toRa = (n) => {
    console.log(ShowText.toRa(n));
    return ShowText.toRa(n)
  }
  getTransactionDetails = () => {

    console.warn(this.key, this.hash);
    chainRequest({
      method: "Gzv_txReceipt",
      params: [this.hash]
    }).then(e => {
      if (e.result) {
        let data = e.result
        let {Receipt, Transaction} = data
        this.setState({td: data, Receipt, Transaction, showLoading: false});
      } else {
        if (this.unmount) {
          return;
        }
        setTimeout(this.getTransactionDetails, 2000);
      }
    }).catch(err => {
      this.setState({showLoading: false})
    })
  }

  copyString = string => {
    Clipboard.setString(string);
    Toast(i18n.reload_copySuccess)
  }

  render() {
    const {Receipt, Transaction} = this.state;
    console.warn(Receipt.contractAddress)
    let statusData = statusObj[Transaction.type] || ""; // todo 未知Type
    let gas_price = this.toRa(Transaction.gas_price) || 0;
    let cumulativeGasUsed = Receipt.cumulativeGasUsed || 0;
    let gasfee = this.toRa(Transaction.gas_price * cumulativeGasUsed) || 0;
    const isFailed = Receipt.status != 0;
    let failReason = ShowText.txErrorText(Receipt.status);
    if (failReason) {
      failReason = ` (${failReason})`;
    }
    const img_source = isFailed
      ? require('../../../img/wallet/icon_fail.png')
      : require('../../../img/wallet/icon_success.png')
    //
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
                source={img_source}></Image>
            </View>
            <View style={{
              flex: 1
            }}>

              <ImageCapInset
                style={styles.connectBox}
                capInsets={{
                top: 120,
                right: 120,
                bottom: 320,
                left: 20
              }}
                resizeMode='stretch'
                source={require('../../../img/wallet/img_chongbi_bg_d.png')}>
                <View style={styles.content_box}>
                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_payInfo}</Text>
                    <Text numberOfLines={1} style={styles.inputValue}>{statusData}
                      <Text style={styles.failText}>{failReason}</Text>
                    </Text>
                  </View>

                  {Transaction.type != 1 && <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_target}</Text>
                    <Text
                      numberOfLines={2}
                      style={styles.inputValue}
                      onPress={() => this.copyString(Transaction.target)}>{Transaction.target}</Text>
                  </View>}

                  {Transaction.type == 1 && <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_call_address}</Text>
                    <Text
                      numberOfLines={2}
                      style={styles.inputValue}
                      onPress={() => this.copyString(Receipt.contractAddress)}>{Receipt.contractAddress}</Text>
                  </View>}

                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_source}</Text>
                    <Text
                      numberOfLines={2}
                      style={styles.inputValue}
                      onPress={() => this.copyString(Transaction.source)}>{Transaction.source}</Text>
                  </View>
                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_value}</Text>
                    <Text numberOfLines={1} style={styles.inputValue}>{Transaction.value + ' ZVC'}</Text>
                  </View>
                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_transfer_minerGas}</Text>
                    <Text numberOfLines={2} style={styles.inputValue}>{Receipt
                        ? gasfee + " = " + cumulativeGasUsed + " * " + gas_price
                        : 'pending'}</Text>
                  </View>
                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_hash}</Text>
                    <Text
                      numberOfLines={2}
                      style={styles.inputValue}
                      onPress={() => this.copyString(Transaction.hash)}>{Transaction.hash}</Text>
                  </View>
                  <View style={styles.dataList}>
                    <Text style={styles.itemTitle}>{i18n.wallet_tx_height}</Text>
                    <Text style={styles.inputValue}>{Receipt.height}</Text>
                  </View>
                  <View style={{
                    height: 70
                  }}></View>
                  <Text style={styles.itemTitle}>{i18n.wallet_tx_mark}</Text>
                  <Text style={styles.noteBox} numberOfLines={2}>
                    {Transaction.extra_data}
                  </Text>
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
                    Linking.openURL(`https://explorer.zvchain.io/?${ (new Date).getTime()}#/${Config.WEB_KEY}/tx/${this.hash}`)
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
    height: 574
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
    width: 100,
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
  },
  failText: {
    fontSize: 15,
    color: '#FE7C7C'
  }

})
