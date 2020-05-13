import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import {
  NavBar,
  TopPadding,
  Button,
  InputView,
  InputWithAnimate,
  Loading,
  KeyboardAwareScrollView
} from '../../../widget/AllWidget'
import {
  Config,
  Toast,
  i18n,
  UserData,
  ShowText,
  NavigationService,
  ConstValue,
  ValueVerify
} from '../../../unit/AllUnit';
import ImageCapInset from 'react-native-image-capinsets';
import Confirm from '../view/Confirm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';
import ZrcAction from '../../../redux/actions/ZrcAction';
import {BigNumber} from 'bignumber.js/bignumber';
import GasSet from '../view/GasSet';
const JSONbig = require('json-bigint');

const {MIN_GAS_LIMIT, MIN_GAS_PRICE, TX_TYPE_CALL} = ConstValue;

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      target: '',
      value: '',
      showConfirm: false,
      showLoading: false
    };

    const account = ZrcAction.selectedZrc();
    this.decimal = account.decimal
  }

  onValueChange = value => {

    value = BigNumber(value)
    if (isNaN(value)) 
      value = ''
    this.setState({value})
  }
  onTargetChange = target => {
    this.setState({target})
  }

  onValueBlur = () => {
    let {value} = this.state
    value = ShowText.showZV(value, this.decimal)

    if (isNaN(value)) 
      value = '';
    value = value.toString();
    this.setState({value})
  }

  componentDidMount() {
    const {updateNonce, updateSelectedBalance, updateValue} = this.props;
    updateNonce(); //更新nonce
    updateValue();

  }

  onSetQrdata = data => {
    let {target, value} = this.state;
    if (data.address) {
      target = data.address
    }
    if (data.value) {
      value = BigNumber(data.value)
      if (isNaN(value)) 
        value = ''
    }
    this.setState({
      target,
      value: value + ''
    })
  }
  getQRCodeCallBack = (qrcode = '') => {
    const data = ShowText.dataFromQrcode(qrcode)
    this.onSetQrdata(data)
  }
  onQrPress = () => {
    NavigationService.toQrcode(this.getQRCodeCallBack);
  }

  onGasChange = ({gas, gasprice}) => {
    this.gas = gas;
    this.gasprice = gasprice;
  }

  onNextPress = () => {

    const {target, value} = this.state;

    const {gas, gasprice} = this;

    if (!value) {
      Toast(i18n.wallet_transfer_amountInfo)
      return;
    }

    if (BigNumber(value).gt(BigNumber(ZrcAction.selectedZrc().value))) {
      Toast(i18n.recharge_tooMore)
      return;
    }
    if (!target) {
      Toast(i18n.wallet_transfer_addressErr)
      return;
    }
    if (!ValueVerify.isAddress(target)) {
      Toast(i18n.wallet_notZVAddress)
      return;
    }
    if (gas < MIN_GAS_LIMIT) {
      Toast(i18n.wallet_transfer_gasLimitErr + MIN_GAS_LIMIT)
      return;
    }
    this.setState({showConfirm: true})
  }

  onConfirmPress = () => {
    this.setState({showConfirm: false});
    UserData.authWalletPassword(this.onGetPassword);
  }

  onGetPassword = () => {
    const {address, decimal} = ZrcAction.selectedZrc();
    const {target, value} = this.state;
    const {gas, gasprice} = this;
    this.setState({showLoading: true})
    data = {
      func_name: 'transfer',
      args: [
        target, BigNumber(value).times(Math.pow(10, decimal))
      ]
    }

    WalletAction.SignAndPost({
      data: JSONbig.stringify(data),
      target: address,
      gas,
      gasprice: gasprice,
      tx_type: TX_TYPE_CALL
    }, data => {
      console.warn(data);
      this.setState({showLoading: false})
      if (data && data.error) {
        Toast(data.error.message || 'error')
      } else {
        NavigationService.navigate('CommonSuccess');
        NavigationService.deleteRoute('ZrcTransfer');
      }

    })

  }

  render() {
    const {target, value, showConfirm} = this.state;
    const account = ZrcAction.selectedZrc();
    const address = account.address;
    let balance = account.value;

    let allBalance = ShowText.toFix(balance, this.decimal, true)

    const {gas, gasprice} = this;

    return (
      <View style={styles.container}>
        <NavBar
          title={i18n.wallet_tx_type0}
          color='#fff'
          backgroundColor='rgba(0,0,0,0)'
          hideLine
          right={[{
            title: 'white_qrcode',
            onPress: this.onQrPress
          }
        ]}/>

        <View style={styles.container}>
          <Image
            source={require('../../../img/wallet/top_bg_receive.png')}
            style={styles.topBg}/>
          <ImageCapInset
            style={styles.bg}
            capInsets={{
            top: 120,
            right: 120,
            bottom: 320,
            left: 20
          }}
            resizeMode='stretch'
            source={require('../../../img/wallet/img_chongbi_bg.png')}>

            <View style={styles.balanceV}>
              <Text style={styles.balance}>{i18n.recharge_balance}</Text>

              <Text style={styles.textValue} numberOfLines={0}>
                {allBalance}
                {' ' + account.name}
              </Text>

            </View>

            <KeyboardAwareScrollView>
              <InputView
                width={Config.width - 30}
                height={54}
                leftWidth={85}
                borderBottomWidth={0.5}
                marginHorizontal={0}
                paddingHorizontal={10}
                inputProps={{
                placeholder: i18n.wallet_transfer_amountInfo,
                value: value,
                keyboardType: 'numeric',
                onChangeText: this.onValueChange,
                onBlur: this.onValueBlur
              }}>{i18n.wallet_tx_value}</InputView>
              <TopPadding width={Config.width - 30}/>
              <InputView
                width={Config.width - 30}
                height={54}
                leftWidth={85}
                borderBottomWidth={0.5}
                marginHorizontal={0}
                paddingHorizontal={10}
                inputProps={{
                placeholder: i18n.wallet_transfer_addressInfo,
                value: target,
                onChangeText: this.onTargetChange
              }}>{i18n.wallet_transfer_address}</InputView>

              <TopPadding width={Config.width - 30}/>

              <GasSet gas='100000' onGasChange={this.onGasChange}></GasSet>

            </KeyboardAwareScrollView>
            <View style={styles.flex1}></View>
            <Button style={styles.button} onPress={this.onNextPress}>{i18n.my_continue}</Button>
          </ImageCapInset>
        </View>

        {showConfirm && <Confirm
          coinName={account.name}
          value={value}
          target={target}
          gas={gasprice * gas}
          address={WalletAction.selectedAccount().address}
          onPress={this.onConfirmPress}
          onHide={() => this.setState({showConfirm: false})}/>}

        {this.state.showLoading && <Loading showLoading={true}></Loading>}

      </View>
    )
  }

}

const topBgHeight = Config.width / 375 * 214

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  topBg: {
    width: Config.width,
    height: topBgHeight,
    resizeMode: 'contain',
    marginTop: -Config.navBarHeight - 2
  },
  bg: {
    width: Config.width - 10,
    height: Config.height - 62 - Config.statusBarHeight,
    alignItems: 'center',
    marginTop: 10 + Config.navBarHeight - topBgHeight,
    paddingTop: 30
  },
  balanceV: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Config.width - 50
  },
  textValue: {
    fontSize: 18,
    fontFamily: "PingFangSC-Medium",
    fontWeight: '500',
    color: "#383276"
  },
  decimalValue: {
    fontSize: 18
  },
  balance: {
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
    marginRight: 10,
    width: 85
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Config.width - 30,
    padding: 10,
    paddingRight: 15,
    paddingLeft: 25
  },
  text: {
    fontSize: 15,
    color: '#333'
  },
  flex1: {
    flex: 1,
    width: 100
  },
  button: {
    marginBottom: 50,
    width: Config.width - 50
  }
});

export default connect(state => ({zrc: state.zrc}), dispatch => ({
  updateValue: bindActionCreators(ZrcAction.updateValue, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch),
  updateSelectedBalance: bindActionCreators(WalletAction.updateSelectedBalance, dispatch)
}))(Page)