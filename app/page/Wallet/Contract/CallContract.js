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
import {NavBar, KeyboardAwareScrollView, Button, InputWithAnimate, Loading} from '../../../widget/AllWidget'
import {
  Config,
  chainRequest,
  ConstValue,
  Toast,
  NavigationService,
  UserData,
  i18n
} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';
const {MIN_GAS_LIMIT, MIN_GAS_PRICE, TX_TYPE_CALL} = ConstValue;
import {BigNumber} from 'bignumber.js/bignumber';
import Confirm from '../view/Confirm';
class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gasPrice: MIN_GAS_PRICE + '',
      gasLimit: MIN_GAS_LIMIT + '',
      ContractaAds: '',
      Loading: false,
      abi: [],
      activehover: -1,
      Parameter: [],
      ParameterValue: [],
      showConfirm: false,
      showLoading: false
    };

  }

  render() {
    let {
      abi,
      Parameter,
      ParameterValue,
      activehover,
      gasPrice,
      gasLimit,
      ContractaAds,
      showConfirm,
    } = this.state;
    const {address} = WalletAction.selectedAccount();
    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_call}/>
        <InputWithAnimate
          inputProps={{
          value: ContractaAds,
          onChangeText: this.onGasAdsChange,
          onBlur: this.getApiList
        }}>{i18n.wallet_call_address}</InputWithAnimate>
        <InputWithAnimate
          inputProps={{
          onChangeText: this.onGasLimitChange,
          keyboardType: 'numeric',
          value: this.state.gasLimit
        }}>Gas Limit</InputWithAnimate>
        <InputWithAnimate
          inputProps={{
          onChangeText: this.onGasPriceChange,
          keyboardType: 'numeric',
          value: this.state.gasPrice
        }}>Gas Price</InputWithAnimate>
        <KeyboardAwareScrollView>

          <Text style={styles.text}>{i18n.wallet_call_abiSelected}</Text>
          <View style={styles.abiBox}>
            {abi.map((item, index) => {
              return <TouchableOpacity
                onPress={() => {
                this.handleClickBtn(item, index)
              }}
                style={[
                styles.abibtnA, {
                  backgroundColor: index == this.state.activehover
                    ? '#D8AC67'
                    : "#F1C073"
                }
              ]}
                key={index}>
                <Text style={styles.abibtn}>{item.func_name}</Text>
              </TouchableOpacity>
            })}
          </View>
          {Parameter.map((item, index) => (
            <InputWithAnimate
              key={index}
              inputProps={{
              onChangeText: (e) => {
                this.onParameterChange(e, index)
              },
              value: ParameterValue[index]
            }}>
              {i18n.wallet_call_param}{index + 1}
              ({item})
            </InputWithAnimate>
          ))}
          {activehover != -1 && (
            <Button onPress={this.onNextPress}>{i18n.wallet_call}</Button>
          )}
        </KeyboardAwareScrollView>

        {showConfirm && <Confirm
          title={i18n.wallet_call_confirm}
          info={i18n.wallet_call}
          value={0}
          target={ContractaAds}
          gas={gasPrice * gasLimit}
          address={address}
          onPress={this.onConfirmPress}
          onHide={() => this.setState({showConfirm: false})}/>}


        {this.state.showLoading && <Loading showLoading={true}></Loading>}
      </View>
    )
  }

  componentDidMount() {
    const updateNonce = this.props.updateNonce;
    updateNonce();
  }
  handleClickBtn = (item, index) => {
    this.setState({Parameter: item.args || [], activehover: index, ParameterValue: []})
  }
  onNextPress = () => {
    console.log(this.state.ParameterValue)
    let {gasPrice, gasLimit, ParameterValue, Parameter} = this.state

    if (gasPrice < MIN_GAS_PRICE) {
      Toast(i18n.wallet_transfer_gasPriceErr + MIN_GAS_PRICE)
      return;
    }
    if (gasLimit < MIN_GAS_LIMIT) {
      Toast(i18n.wallet_transfer_gasLimitErr + MIN_GAS_LIMIT)
      return;
    }

    let needParam = false;
    Parameter.forEach((i, index) => {
      if (!ParameterValue[index]) 
        needParam = true;
      }
    );
    if (needParam) {
      Toast(i18n.wallet_call_paramErr)
      return;
    }

    this.setState({showConfirm: true})
  }

  onConfirmPress = () => {
    this.setState({ showConfirm: false })
    UserData.authWalletPassword(this.onGetPassword)  }

  onGetPassword = pwd => {

    let {
      gasPrice,
      gasLimit,
      ParameterValue,
      Parameter,
      abi,
      activehover
    } = this.state

    const func_name = abi[activehover].func_name;
    const args = [];

    Parameter.forEach((item, index) => {
      let arg = ParameterValue[index]
      console.warn(arg);

      if (item != 'str') {
        arg = JSON.parse(arg)
      }
      args.push(arg)
    })

    const data = {
      func_name,
      args
    }

    const {nonce, sk} = WalletAction.selectedAccount();
    this.setState({showLoading: true})

    WalletAction.SignAndPost({
      sk: sk,
      data: JSON.stringify(data),
      target: this.state.ContractaAds,
      gas: gasLimit,
      gasprice: gasPrice,
      tx_type: TX_TYPE_CALL,
      nonce: nonce
    }, data => {
      this.setState({showLoading: false})
      if (data && data.error) {
        Toast(data.error.message || 'error')
      } else {
        NavigationService.navigate('CommonSuccess', {hash: data.result});
        NavigationService.deleteRoute('CallContract');
   
      }
    })

  }

  onGasAdsChange = (e) => {
    this.setState({ContractaAds: e})
  }
  onGasLimitChange = (e) => {
    this.setState({
      gasLimit: this.toFixedValue(e)
    })
  }
  onGasPriceChange = (e) => {
    this.setState({
      gasPrice: this.toFixedValue(e)
    })
  }
  toFixedValue = value => {
    value = BigNumber(value).toFixed() + ''
    if (isNaN(value)) 
      value = ''
    return value;
  }

  onParameterChange = (e, index) => {
    let values = [...this.state.ParameterValue]

    values[index] = e
    this.setState({ParameterValue: values})
  }
  getApiList = () => {
    this.setState({Loading: true})

    chainRequest({
      "method": "Gzv_viewAccount",
      "params": [this.state.ContractaAds]
    }).then(result => {

      let abi = []
      if (result.result && result.result.abi) {
        abi = result.result.abi;
      }
      this.setState({abi, Loading: false})
    }).catch(err => {
      console.warn(err);
      this.setState({Loading: false})
    })
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
    paddingTop: 15,
    alignSelf: 'flex-start'
  },
  inputV: {
    width: Config.width - 30,
    height: 90,
    padding: 15,
    paddingHorizontal: 10,
    margin: 15,
    backgroundColor: '#EBEBF2',
    borderRadius: 4
  },
  input: {
    width: Config.width - 50,
    height: 60,
    textAlign: 'auto',
    fontSize: 13,
    color: '#333'
  },
  abiBox: {
    paddingTop: 15,
    paddingLeft: 35,
    paddingRight: 35,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  abibtnA: {
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 15,
    marginRight: 15,
    backgroundColor: "#F1C073"
  },
  abibtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500'
  }

});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  deleteAccount: bindActionCreators(WalletAction.deleteAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch),
}))(Page)