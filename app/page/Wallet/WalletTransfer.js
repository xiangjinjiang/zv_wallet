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
} from '../../widget/AllWidget'
import {
  Config,
  Toast,
  i18n,
  UserData,
  ShowText,
  NavigationService,
  ConstValue,
  ValueVerify
} from '../../unit/AllUnit';
import ImageCapInset from 'react-native-image-capinsets';
import Confirm from './view/Confirm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../redux/actions/WalletAction';
import {BigNumber} from 'bignumber.js/bignumber';
import GasSet from './view/GasSet';

const {MIN_GAS_LIMIT, MIN_GAS_PRICE, TX_TYPE_TRANSEFER} = ConstValue;

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      target: '',
      value: '',
      showConfirm: false,
      showLoading: false
    };

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

  oneEtraDataChange = extraData => this.extraData = extraData;

  componentDidMount() {
    const {updateNonce, updateSelectedBalance} = this.props;
    updateNonce(); //更新nonce
    updateSelectedBalance();

    // 处理从钱包首页传入qrcode的情况
    const params = this.props.navigation.state.params;
    if (params && params.data) {
      this.onSetQrdata(params.data)
    }
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
    let balance = WalletAction
      .selectedAccount()
      .value;

    if (!BigNumber(value).lt(BigNumber(balance))) {
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
    const {nonce, sk, address} = WalletAction.selectedAccount();
    const {target, value} = this.state;
    const {gas, gasprice} = this;
    this.setState({showLoading: true})

    WalletAction.SignAndPost({
      sk: sk,
      data: '',
      target,
      value: value,
      gas,
      gasprice: gasprice,
      tx_type: TX_TYPE_TRANSEFER,
      nonce,
      extra_data: this.extraData
    }, data => {
      console.warn(data);
      this.setState({showLoading: false})
      if (data && data.error) {
        Toast(data.error.message || 'error')
      } else {
        const params = this.props.navigation.state.params;
        const hash = data.result;
        if (params && params.callback) {
          params.callback(address, hash)
        }
        NavigationService.navigate('CommonSuccess', {hash, type: 0});
        NavigationService.deleteRoute('WalletTransfer');
      }

    })

  }

  render() {
    const {target, value, showConfirm} = this.state;
    const account = WalletAction.selectedAccount()
    const address = account.address;
    let balance = account.value;

    let allBalance = ShowText.toFix(balance, 4, true)
    if (!allBalance || allBalance.length < 6) {
      allBalance = '0.0000'
    }
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
            source={require('../../img/wallet/top_bg_receive.png')}
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
            source={require('../../img/wallet/img_chongbi_bg.png')}>

            <View style={styles.balanceV}>
              <Text style={styles.balance}>{i18n.recharge_balance}</Text>
              <Text style={styles.textValue} numberOfLines={0}>{allBalance.slice(0, -5)}
                <Text style={styles.decimalValue}>
                  {allBalance.slice(allBalance.length - 5)}
                  &nbsp;ZVC
                </Text>

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
                onChangeText: this.onValueChange
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
              <InputView
                width={Config.width - 30}
                height={54}
                leftWidth={85}
                marginHorizontal={0}
                paddingHorizontal={10}
                inputProps={{
                placeholder: i18n.wallet_transfer_mark,
                onChangeText: this.oneEtraDataChange
              }}>{i18n.wallet_transfer_mark}</InputView>
              <TopPadding width={Config.width - 30}/>

              <GasSet onGasChange={this.onGasChange}></GasSet>

            </KeyboardAwareScrollView>
            <View style={styles.flex1}></View>
            <Button style={styles.button} onPress={this.onNextPress}>{i18n.my_continue}</Button>
          </ImageCapInset>
        </View>

        {showConfirm && <Confirm
          value={value}
          target={target}
          gas={gasprice * gas}
          address={address}
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
    fontSize: 25,
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

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  deleteAccount: bindActionCreators(WalletAction.deleteAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch),
  updateSelectedBalance: bindActionCreators(WalletAction.updateSelectedBalance, dispatch)
}))(Page)