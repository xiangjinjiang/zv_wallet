import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {NavBar, TopPadding, Button, InputView, KeyboardAwareScrollView} from '../../../widget/AllWidget'
import {
  Config,
  post,
  i18n,
  NavigationService,
  ConstValue,
  UserData,
  TxManager,
  Toast,
  fullUrlRequest
} from '../../../unit/AllUnit';
import WalletAction from '../../../redux/actions/WalletAction';
import ZrcAction from '../../../redux/actions/ZrcAction';
import {navBarHeight, isZh} from '../../../unit/Config';
import Confirm from '../view/Confirm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {BigNumber} from 'bignumber.js/bignumber';
import ImageCapInset from 'react-native-image-capinsets';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initAmount: '',
      decimal: '',
      gas_price: 500,
      gas_limit: 100000,
      showConfirm: false
    };
  }

  onFullNameChange = fullName => this.fullName = fullName;
  onNameChange = name => this.name = name;
  onInitAmountChange = initAmount => {
    initAmount = BigNumber(initAmount).toFixed(0);
    if (isNaN(initAmount)) {
      initAmount = '';
    }
    this.setState({initAmount})
  }
  onDecimalChange = decimal => {
    decimal = BigNumber(decimal).toFixed(0);
    if (isNaN(decimal)) {
      decimal = '';
    }
    this.setState({decimal})
  }

  componentWillMount() {
    this
      .props
      .updateNonce();

  }

  onNextPress = () => {
    const {fullName, name} = this;
    const {initAmount, decimal} = this.state;
    if (!fullName) {
      Toast(i18n.zrc_fullNameInfo)
      return;
    }
    if (fullName.length > 64) {
      Toast(i18n.zrc_fullNameErr)
      return;
    }
    if (!name) {
      Toast(i18n.zrc_nameInfo)
      return;
    }
    if (name.length > 16) {
      Toast(i18n.zrc_nameErr)
      return;
    }
    if (/^[0-9a-zA-Z]*$/.test(name) == false) {
      Toast(i18n.zrc_nameLetterErr)
      return;
    }
    if (initAmount <= 0) {
      Toast(i18n.zrc_initAmountInfo)
      return;
    }
    if (initAmount >= 1e12) {
      Toast(i18n.zrc_initAmountErr)
      return;
    }
    if (decimal < 0 || decimal == '') {
      Toast(i18n.zrc_decimalInfo)
      return;
    }
    if (decimal > 9) {
      Toast(i18n.zrc_decimalErr)
      return;
    }
    this.setState({showConfirm: true})
  }

  onConfirmPress = () => {
    this.setState({showConfirm: false})
    UserData.authWalletPassword(this.ongetPwd)
  }

  ongetPwd = () => {

    const {fullName, name} = this;

    const {initAmount, decimal} = this.state;
    const code = getContractCode(fullName, name, BigNumber(initAmount).multipliedBy(Math.pow(10, decimal)), decimal);
    const {gas_price, gas_limit} = this.state;

    WalletAction.SignAndPost({
      data: JSON.stringify({code, contract_name: 'Token'}),
      gas: gas_limit,
      gasprice: gas_price,
      tx_type: ConstValue.TX_TYPE_CONTRACT,
      zrcItem: {
        name,
        decimal,
        value: initAmount,
        isCreated: true
      }
    }, data => {
      if (data && data.error) {
        Toast(data.error.message || 'error')
      } else {
        const url_tianquan = 'https://tianquanexplorer.zvchain.io:8000/deploy_token';
        const url_kaiyang = 'https://explorer.taschain.cn/test/api/deploy_token';
        let url = Config.WEB_KEY == 'MainNet'   ? url_tianquan   : url_kaiyang
        // let url = 'http://10.0.0.129:9000/deploy_token';

        fullUrlRequest(url, {tx_hash: data.result})

        NavigationService.navigate('CommonSuccess', {
          hash: data.result,
          disappear: () => {
            Toast(i18n.zrc_createSuccessToast)
            NavigationService.navigate('Zrc');
          }
        });
        NavigationService.deleteRoute('CreateZrc')
      }
    })

  }

  render() {
    const {gas_price, gas_limit, showConfirm, initAmount, decimal} = this.state;

    const {address} = WalletAction.selectedAccount();

    return (
      <View style={styles.container}>
        <NavBar title={i18n.zrc_create}/>
        <TopPadding></TopPadding>

        <KeyboardAwareScrollView>

          <ImageCapInset
            style={styles.bg}
            capInsets={{
            top: 310,
            right: 40,
            bottom: 20,
            left: 40
          }}
            source={require('../../../img/zrc/create_zrc_bg.png')}>

            <InputView
              width={Config.width - 30}
              height={54}
              leftWidth={85}
              borderBottomWidth={0.5}
              marginHorizontal={0}
              paddingHorizontal={10}
              inputProps={{
              onChangeText: this.onFullNameChange,
              placeholder: i18n.zrc_fullNameP
            }}>{i18n.zrc_fullName}</InputView>

            <InputView
              width={Config.width - 30}
              height={54}
              leftWidth={85}
              borderBottomWidth={0.5}
              marginHorizontal={0}
              paddingHorizontal={10}
              inputProps={{
              onChangeText: this.onNameChange,
              placeholder: i18n.zrc_nameP
            }}>{i18n.zrc_name}</InputView>

            <InputView
              width={Config.width - 30}
              height={54}
              leftWidth={85}
              borderBottomWidth={0.5}
              marginHorizontal={0}
              paddingHorizontal={10}
              inputProps={{
              onChangeText: this.onInitAmountChange,
              value: initAmount,
              keyboardType: 'number-pad',
              placeholder: i18n.zrc_amountP
            }}>{i18n.zrc_initAmount}</InputView>

            <InputView
              width={Config.width - 30}
              height={54}
              leftWidth={85}
              borderBottomWidth={0.5}
              marginHorizontal={0}
              paddingHorizontal={10}
              inputProps={{
              onChangeText: this.onDecimalChange,
              value: decimal,
              keyboardType: 'number-pad',
              placeholder: i18n.zrc_deecimalP
            }}>{i18n.zrc_decimal}</InputView>

            <View style={styles.infoView}>
              <Text style={styles.infoText}>{'\n'}{i18n.zrc_createInfo}{'\n'}</Text>
            </View>

          </ImageCapInset>

        </KeyboardAwareScrollView>

        <Button style={styles.button} onPress={this.onNextPress}>{i18n.send_confirm}</Button>

        {showConfirm && <Confirm
          title={i18n.wallet_deploy_confirm}
          info={i18n.wallet_deploy}
          value={0}
          target={0}
          gas={gas_price * gas_limit}
          address={address}
          onPress={this.onConfirmPress}
          onHide={() => this.setState({showConfirm: false})}/>}

      </View>
    )
  }

}

const bgHeight = isZh
  ? 385
  : 405;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    marginBottom: 50
  },
  bg: {
    width: Config.width - 10,
    height: bgHeight,
    paddingHorizontal: 10,
    paddingVertical: 15,
    paddingTop: 10
  },
  infoView: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    paddingHorizontal: 26,
    backgroundColor: Config.appColor,
    alignItems: 'center',
    borderBottomLeftRadius: 4,
    borderBottomEndRadius: 4
  },

  infoText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18.5
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch),
  addZrc: bindActionCreators(ZrcAction.addZrc, dispatch)
}))(Page)

function getContractCode(fullName, name, initAmount, decimal) {
  return `TransferEvent = Event("transfer")
class Token(object):
    def __init__(self):
        self.name = "${fullName}"
        self.symbol = "${name}"
        self.decimal = ${decimal}
        self.totalSupply = ${initAmount}
        self.balanceOf = zdict()
        self.allowance = zdict()
        self.balanceOf[msg.sender] = self.totalSupply

    def _transfer(self, _from, _to, _value):
        if _to not in self.balanceOf:
            self.balanceOf[_to] = 0
        if _from not in self.balanceOf:
            self.balanceOf[_from] = 0
        # Whether the account balance meets the transfer amount
        if self.balanceOf[_from] < _value:
            return False
        # Check if the transfer amount is legal
        if _value <= 0:
            return False
        # Transfer
        self.balanceOf[_from] -= _value
        self.balanceOf[_to] += _value
        return True

    @register.public(str, int)
    def transfer(self, _to, _value):
        if self._transfer(msg.sender, _to, _value):
            TransferEvent.emit(msg.sender, _to, _value)
        else:
            raise Exception("")

    @register.public(str, int)
    def approve(self, _spender, _value):
        if _value <= 0:
            raise Exception('')
        if msg.sender not in self.allowance:
            self.allowance[msg.sender] = zdict()
        self.allowance[msg.sender][_spender] = _value

    @register.public(str, str, int)
    def transfer_from(self, _from, _to, _value):
        if _value > self.allowance[_from][msg.sender]:
            raise Exception('')
        self.allowance[_from][msg.sender] -= _value
        if self._transfer(_from, _to, _value):
            TransferEvent.emit(_from, _to, _value)
        else:
            raise Exception("")

    @register.public(int)
    def burn(self, _value):
        if _value <= 0:
            raise Exception('')
        if self.balanceOf[msg.sender] < _value:
            raise Exception('')
        self.balanceOf[msg.sender] -= _value
        self.totalSupply -= _value`
}