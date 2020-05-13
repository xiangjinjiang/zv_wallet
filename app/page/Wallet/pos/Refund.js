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
import {
  NavBar,
  TopPadding,
  Button,
  Loading,
  KeyboardAwareScrollView,
  Picker,
  InputView
} from '../../../widget/AllWidget'
import {
  Config,
  ConstValue,
  Toast,
  NavigationService,
  i18n,
  fullUrlRequest,
  UserData
} from '../../../unit/AllUnit';
import ImageCapInset from 'react-native-image-capinsets';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import WalletAction from '../../../redux/actions/WalletAction';
import {BigNumber} from 'bignumber.js/bignumber';
import Confirm from '../view/Confirm';
import GasSet from '../view/GasSet';
const {MIN_GAS_LIMIT, MIN_GAS_PRICE, TX_TYPE_STAKEREFUND} = ConstValue;

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: {
        name: ' ',
        refund: 0,
        showConfirm: false,
        showLoading: false
      }
    };
    this.refundList = [];
  }

  componentWillMount() {
    let {address} = WalletAction.selectedAccount();

    fullUrlRequest(Config.PLEDGE_HOST + '/assets/refund', {
      address
    }, 'GET').then(data => {
      this.setState({data})
      if (!data || !data.length) {
        Toast(i18n.no_data)
      } else {
        this.refundList = data;
        this.setState({selectedItem: data[0]})
      }
    })

    const {updateNonce} = this.props;
    updateNonce(); //更新nonce
  }

  onSelectePress = () => {
    let data = [];
    const {address} = WalletAction.selectedAccount();

    this
      .refundList
      .forEach(item => {
        let name = item.name;
        if (address == item.address) {
          name = i18n.refund_myAddress
        }
        data.push(name)
      });

    if (!data || !data.length) {
      Toast(i18n.no_data);
      return;
    }
    Picker.show({
      pickerData: data,
      onPickerConfirm: (duration, index) => {
        this.setState({
          selectedItem: this.refundList[index[0]]
        })
      }
    })
  }

  onGasChange = ({gas, gasprice, showSet}) => {
    this.gas = gas;
    this.gasprice = gasprice;
    this.setState({showSet})
  }

  onConfirmPress = () => {
    this.setState({showConfirm: false});
    UserData.authWalletPassword(this.onGetPassword);
  }

  onNextPress = () => {
    const {gas, gasprice} = this;
    let {address, refund} = this.state.selectedItem;
    if (!refund) {
      Toast(i18n.recharge_tooMore)
      return;
    }
    if (gas < MIN_GAS_LIMIT) {
      Toast(i18n.wallet_transfer_gasLimitErr + MIN_GAS_LIMIT)
      return;
    }
    this.setState({showConfirm: true})
  }

  onGetPassword = pwd => {
    const {nonce} = WalletAction.selectedAccount();
    const {gas, gasprice} = this;
    let {address} = this.state.selectedItem;
    this.setState({showLoading: true})

    WalletAction.SignAndPost({
      tx_type: TX_TYPE_STAKEREFUND,
      target: address,
      value: 0,
      gas,
      gasprice: gasprice,
      nonce
    }, data => {
      this.setState({showLoading: false})

      if (data && data.error) {
        Toast(data.error.message || 'error')
      } else {
        const hash = data.result;
        NavigationService.navigate('CommonSuccess', {hash});
      }
    });
  }

  render() {
    const {gas, gasprice} = this;
    const account = WalletAction.selectedAccount();
    const {showConfirm, showPassword} = this.state;
    let {address, name, refund, flag} = this.state.selectedItem;
    if (address == account.address) {
      name = i18n.refund_myAddress;
    }

    return (
      <View style={styles.container}>
        <NavBar title={i18n.refund_title}/>
        <TopPadding></TopPadding>
        <KeyboardAwareScrollView>
          <ImageCapInset
            style={[
            styles.bg, {
              height: this.state.showSet
                ? 518
                : 405
            }
          ]}
            capInsets={{
            top: 300,
            right: 40,
            bottom: 10,
            left: 40
          }}
            source={require('../../../img/wallet/img_refund_bg.png')}>

            <InputView
              width={Config.width - 30}
              height={54}
              leftWidth={85}
              borderBottomWidth={0.5}
              marginHorizontal={0}
              paddingHorizontal={20}
              color={Config.appColor}
              onPress={this.onSelectePress}
              renderRight={(<Image source={require('../../../img/home/bottom_arrow.png')}/>)}
              inputProps={{
              value: name
            }}>{i18n.pos_posAddress}</InputView>

            <Text style={styles.canRefund}>{i18n.wallet_refundBalance}
              <Text style={styles.refundValue}>{` ${refund} ZVC`}</Text>
            </Text>
            <View style={styles.marginV}/>
            <GasSet onGasChange={this.onGasChange}></GasSet>

            <View style={styles.infoView}>
              <Text style={styles.infoText}>{i18n.refund_info}</Text>
            </View>
          </ImageCapInset>
          <Button
            style={styles.button}
            onPress={this.onNextPress}
            disable={flag == false}>{i18n.send_confirm}</Button>

        </KeyboardAwareScrollView>
        {showConfirm && <Confirm
          title={i18n.wallet_tx_type6}
          info={i18n.wallet_tx_type6}
          value={refund}
          address={account.address}
          target={address}
          gas={(gas * gasprice)}
          onPress={this.onConfirmPress}
          onHide={() => this.setState({showConfirm: false})}/>}
        {showPassword && <WalletPassword onHide={this.onGetPassword}/>}
        {this.state.showLoading && <Loading showLoading={true}></Loading>}

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
    // height: 409,
    alignItems: 'center',
    paddingTop: 10
  },

  canRefund: {
    padding: 10,
    paddingLeft: 20,
    fontSize: 13,
    color: '#999',
    alignSelf: 'flex-start'
  },
  refundValue: {
    color: Config.appColor
  },

  marginV: {
    height: 74,
    width: Config.width - 30,
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 0.5
  },

  infoView: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 104,
    justifyContent: 'center',
    backgroundColor: Config.appColor,
    paddingHorizontal: 26,
    borderBottomLeftRadius: 4,
    borderBottomEndRadius: 4
  },
  infoText: {
    color: '#fff',
    fontSize: 13
  },
  button: {
    marginTop: 20
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  deleteAccount: bindActionCreators(WalletAction.deleteAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch)
}))(Page)