import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  NativeModules,
  ScrollView
} from 'react-native';
import {NavBar, Button, InputWithAnimate, Loading} from '../../../widget/AllWidget'
import {
  Config,
  NavigationService,
  fullUrlRequest,
  post,
  Toast,
  ConstValue,
  UserData,
  i18n
} from '../../../unit/AllUnit';
import {BigNumber} from 'bignumber.js/bignumber';
import Confirm from '../view/Confirm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';

const {MIN_GAS_LIMIT, MIN_GAS_PRICE, TX_TYPE_CONTRACT} = ConstValue;
const Wallet = NativeModules.Wallet;

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "gas_price": '',
      "gas_limit": '',
      "code": "",
      "contract_name": "",
      showConfirm: false,
      showLoading: false
    };
  }

  onGasPriceChange = gas_price => this.setState({
    gas_price: this.toFixedValue(gas_price)
  })
  onGasLimitChange = gas_limit => this.setState({
    gas_limit: this.toFixedValue(gas_limit)
  })
  onNameChange = contract_name => this.setState({contract_name})

  toFixedValue = value => {
    value = BigNumber(value).toFixed() + ''
    if (isNaN(value)) 
      value = ''
    return value;
  }

  getQRCodeCallBack = (qrcode) => {
    this.getJson(qrcode)
  }
  onQrPress = () => {
    NavigationService.toQrcode(this.getQRCodeCallBack)
  }

  componentDidMount() {
    const params = this.props.navigation.state.params;
    if (params && params.data) {
      this.getJson(params.data.url)
    }
    const updateNonce = this.props.updateNonce;
    updateNonce(); //更新nonce
  }

  getJson = (url) => {

    let index = url.indexOf('key=');
    if (index) {
      const key = url.substr(index + 4, url.length - index - 1)
      this.key = key;
    } else {
      Toast('url Error');
      return;
    }

    fullUrlRequest(url, {}, 'GET').then(res => {
      if (!res) {
        return;
      }
      const {error_msg, data} = res;
      if (error_msg) {
        Toast(error_msg)
        return;
      }
      if (data) {
        data.gas_limit = data.gas_limit + '';
        data.gas_price = data.gas_price + '';
        this.setState(data)
      }
    })

  }

  onNextPress = () => {

    const {gas_price, gas_limit, contract_name, code} = this.state
    if (!contract_name) {
      Toast(i18n.wallet_deploy_nameErr)
      return;
    }
    if (gas_price < MIN_GAS_PRICE) {
      Toast(i18n.wallet_transfer_gasPriceErr + MIN_GAS_PRICE)
      return;
    }
    if (gas_limit < MIN_GAS_LIMIT) {
      Toast(i18n.wallet_transfer_gasLimitErr + MIN_GAS_LIMIT)
      return;
    }
    if (!code) {
      Toast(i18n.wallet_deploy_codeErr)
      return;
    }

    this.setState({showConfirm: true})
  }

  onConfirmPress = () => {
    this.setState({ showConfirm: false })
    UserData.authWalletPassword(this.onGetPassword)
  }

  onGetPassword = pwd => {
  
    const {gas_price, gas_limit, contract_name, code} = this.state;

    const {nonce, sk} = WalletAction.selectedAccount();
    this.setState({showLoading: true})

    WalletAction.SignAndPost({
      sk: sk,
      data: JSON.stringify({code, contract_name}),
      target: '',
      value: 0,
      gas: gas_limit,
      gasprice: gas_price,
      tx_type: TX_TYPE_CONTRACT,
      nonce,
      extra_data: '',
      key: this.key
    }, data => {
      this.setState({showLoading: false})
      if (data && data.error) {
        Toast(data.error.message || 'error')
      } else {
        NavigationService.navigate('CommonSuccess', {
          hash: data.result,
          key: this.key
        });
        NavigationService.deleteRoute('AddContract');

      }
    })
  }
  render() {
    const {
      gas_price,
      gas_limit,
      code,
      contract_name,
      showConfirm,
    } = this.state;
    const {address} = WalletAction.selectedAccount();

    return (
      <View style={styles.container}>
        <NavBar
          title={i18n.wallet_deploy}
          right={[{
            title: 'qrcode',
            onPress: this.onQrPress
          }
        ]}/>
        <InputWithAnimate
          inputProps={{
          onChangeText: this.onNameChange,
          value: contract_name
        }}>{i18n.wallet_deploy_name}</InputWithAnimate>
        <InputWithAnimate
          inputProps={{
          onChangeText: this.onGasLimitChange,
          keyboardType: 'numeric',
          value: gas_limit
        }}>Gas Limit</InputWithAnimate>
        <InputWithAnimate
          inputProps={{
          onChangeText: this.onGasPriceChange,
          keyboardType: 'numeric',
          value: gas_price
        }}>Gas Price</InputWithAnimate>

        <Text style={styles.text}>{i18n.wallet_deploy_code}</Text>
        <View style={styles.inputV}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.input}>{code}</Text>
          </ScrollView>

        </View>

        <Button onPress={this.onNextPress}>{i18n.wallet_deploy}</Button>

        {showConfirm && <Confirm
          title={i18n.wallet_deploy_confirm}
          info={i18n.wallet_deploy}
          value={0}
          target={0}
          gas={gas_price * gas_limit}
          address={address}
          onPress={this.onConfirmPress}
          onHide={() => this.setState({showConfirm: false})}/>}

        {this.state.showLoading && <Loading showLoading={true}></Loading>}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 15,
    color: '#333',
    paddingLeft: 30,
    paddingTop: 15
  },
  inputV: {
    width: Config.width - 30,
    flex: 1,
    paddingHorizontal: 10,
    margin: 15,
    backgroundColor: '#EBEBF2',
    borderRadius: 4
  },
  input: {
    flex: 1,
    textAlign: 'auto',
    fontSize: 13,
    color: '#333',
    lineHeight: 14
  },
  scroll: {
    padding: 15
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  deleteAccount: bindActionCreators(WalletAction.deleteAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch)
}))(Page)