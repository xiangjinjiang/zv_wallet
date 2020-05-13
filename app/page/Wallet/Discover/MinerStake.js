import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from 'react-native';
import {
  NavBar,
  TopPadding,
  Button,
  Shadow,
  KeyboardAwareScrollView,
  InputWithAnimate,
  InputView
} from '../../../widget/AllWidget'
import {
  Config,
  ConstValue,
  Toast,
  NavigationService,
  i18n,
  fullUrlRequest,
  UserData,
  ShowText
} from '../../../unit/AllUnit';
import ImageCapInset from 'react-native-image-capinsets';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import WalletAction from '../../../redux/actions/WalletAction';
import {BigNumber} from 'bignumber.js/bignumber';
import Confirm from '../view/Confirm';
import GasSet from '../view/GasSet';

const {MIN_GAS_LIMIT, TX_TYPE_STAKEREDUCE, TX_TYPE_STAKEADD, TX_DATA_STAKE_PROPOSER, TX_DATA_MINER_PROPOSER} = ConstValue;

class Page extends Component {
  constructor(props) {
    super(props);
    this.allSeek = 5000;
    this.minSeek = 500;
    this.cellItemList = [
      i18n.my_cancel, i18n.pos_decrease, i18n.pos_add
    ],
    this.state = {
      showSet: false,
      value: '',
      showConfirm: false
    };

    const {address} = WalletAction.selectedAccount()

    const {m_type, tx_type, stakeValue, stakeAddress, poolId} = this.props.navigation.state.params;
    this.m_type = m_type;
    this.tx_type = tx_type;
    this.stakeValue = stakeValue;
    this.poolId = poolId;
    this.stakeAddress = stakeAddress || address;
    this.typeString = tx_type == 3
      ? i18n.miner_add
      : i18n.miner_reduce

  }
  componentDidMount() {
    const {updateSelectedBalance, updateNonce} = this.props;
    updateSelectedBalance();
    updateNonce();
  }

  onValueChange = (value) => {

    value = BigNumber(value).decimalPlaces(0, 1)
    if (isNaN(value)) {
      value = ''
    }
    this.setState({
      value: '' + value
    })
  }

  onGasChange = ({gas, gasprice, showSet}) => {
    this.gas = gas;
    this.gasprice = gasprice;
    this.setState({showSet})
  }

  onNextPress = () => {
    let {value} = this.state;
    const {gas} = this;
    const account = WalletAction.selectedAccount();

    if (!value) {
      Toast(i18n.pos_addErr);
      return;
    }
    if (this.tx_type == TX_TYPE_STAKEADD) { // 增加质质押
      if (BigNumber(value).gt(account.value)) {
        Toast(i18n.recharge_tooMore)
        return;
      }
    } else { // 减少质押
      if (BigNumber(value).gt(this.stakeValue)) {
        Toast(i18n.recharge_tooMore)
        return;
      }
    }

    if (gas < MIN_GAS_LIMIT) {
      Toast(i18n.wallet_transfer_gasLimitErr + MIN_GAS_LIMIT)
      return;
    }

    this.setState({showConfirm: true})
  }

  onConfirmPress = () => {

    if (this.tx_type == TX_TYPE_STAKEADD && this.poolId) {
      this._getfindAvailableStakedAmount((poolCurrentAmount) => {
        if (poolCurrentAmount >= this.state.value) {
          UserData.authWalletPassword(this.onGetPassword);
        } else {
          Toast(i18n.pos_MaxStake + poolCurrentAmount)
        }
      });
      return;
    }

    this.setState({showConfirm: false});
    UserData.authWalletPassword(this.onGetPassword);
  }

  _getfindAvailableStakedAmount = (callback) => {
    fullUrlRequest(Config.PLEDGE_HOST + '/pool/findAvailableStakedAmount', {
      poolId: this.poolId
    }, 'GET').then(res => {
      callback(res)
    }).catch(err => {})
  }

  onGetPassword = () => {
    let {value} = this.state;
    const {gas, gasprice} = this

    WalletAction.SignAndPost({
      target: this.stakeAddress,
      value,
      gas,
      gasprice,
      tx_type: this.tx_type,
      m_type: this.m_type
    }, data => {
      if (data && data.error) {
        Toast(data.error.message || 'error')
      } else {
        NavigationService.navigate('CommonSuccess', {hash: data.result});
        NavigationService.deleteRoute('MinerStake');
      }
    })
  }

  render() {

    const {value, showConfirm} = this.state

    const account = WalletAction.selectedAccount();
    let balance = this.tx_type == TX_TYPE_STAKEADD
      ? ShowText.showZV(account.value)
      : this.stakeValue;

    const {gas, gasprice} = this;

    return (
      <View style={styles.container}>
        <NavBar title={i18n.pos_addDec}></NavBar>
        <TopPadding></TopPadding>
        <KeyboardAwareScrollView>
          <ImageCapInset
            style={[
            styles.bg, {
              height: this.state.showSet
                ? 525
                : 409
            }
          ]}
            capInsets={{
            top: 380,
            right: 40,
            bottom: 10,
            left: 40
          }}
            source={require('../../../img/wallet/img_zhuanbi_bg.png')}>

            <InputView
              width={Config.width - 30}
              height={54}
              leftWidth={85}
              borderBottomWidth={0.5}
              marginHorizontal={0}
              paddingHorizontal={10}
              color={Config.appColor}
              inputProps={{
              value: this.typeString,
              readonly: true,
              autoFocus: true
            }}>{i18n.miner_miner}</InputView>

            <InputView
              width={Config.width - 30}
              height={54}
              leftWidth={85}
              borderBottomWidth={0.5}
              marginHorizontal={0}
              paddingHorizontal={10}
              renderRight={(
              <TouchableOpacity onPress={() => this.onValueChange(balance)}>
                <Text style={styles.wholeBtn}>{i18n.send_All}</Text>
              </TouchableOpacity>
            )}
              inputProps={{
              value,
              onChangeText: this.onValueChange
            }}>{i18n.pos_amount}</InputView>

            <View style={[styles.cellAllItem]}>

              <Text style={styles.cellAllTitle}>
                {i18n.pos_canUse}

              </Text>
              <Text style={styles.dateAllText}>
                {balance + " ZVC"}
              </Text>
            </View>

            <InputView
              width={Config.width - 30}
              height={54}
              leftWidth={85}
              borderBottomWidth={0.5}
              marginHorizontal={0}
              color={'#999'}
              paddingHorizontal={10}
              inputProps={{
              readonly: true,
              value: this.stakeAddress
            }}>{i18n.pos_posAddress}</InputView>
            <View style={styles.marginV}></View>
            <GasSet onGasChange={this.onGasChange}></GasSet>

          </ImageCapInset>
          <View style={styles.container}></View>
          <Button onPress={this.onNextPress}>{this.typeString}</Button>
        </KeyboardAwareScrollView>

        {showConfirm && <Confirm
          title={this.typeString}
          info={this.typeString}
          value={value}
          address={account.address}
          target={this.stakeAddress}
          gas={(gas * gasprice)}
          onPress={this.onConfirmPress}
          onHide={() => this.setState({showConfirm: false})}/>}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bg: {
    width: Config.width - 10,
    alignItems: 'center',
    paddingTop: 10
  },

  cardBox: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 19,
    paddingHorizontal: 5
  },
  cardBgImg: {
    width: Config.width - 10,
    height: 305,
    paddingTop: 15,
    paddingBottom: 19,
    paddingHorizontal: 10
  },
  wholeBtn: {
    fontSize: 15,
    fontWeight: '400',
    color: '#383276',
    alignSelf: 'flex-end'
  },
  cellItem: {
    height: 53,
    borderColor: '#D5D5D5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 11
  },
  cellTitle: {
    fontWeight: '400',
    fontSize: 15,
    color: '#333333'
  },
  dateText: {
    fontWeight: '400',
    fontSize: 13,
    overflow: 'hidden',
    color: '#999999'
  },
  cellAllItem: {
    height: 42,
    paddingTop: 8,
    alignSelf: 'flex-start',
    marginLeft: 25,
    flexDirection: 'row',
    paddingHorizontal: 11
  },
  cellAllTitle: {
    fontWeight: '400',
    color: '#999999',
    fontSize: 13,
    lineHeight: 19
  },
  dateAllText: {
    color: '#383276',
    fontWeight: '400',
    fontSize: 13,
    marginLeft: 10,
    lineHeight: 19
  },
  marginV: {
    marginTop: 68
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  createWallet: bindActionCreators(WalletAction.createWallet, dispatch),
  updateSelectedBalance: bindActionCreators(WalletAction.updateSelectedBalance, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch)
}))(Page);
