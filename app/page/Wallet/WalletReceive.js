import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  Clipboard,
  ImageBackground
} from 'react-native';
import {NavBar, TopPadding, Button} from '../../widget/AllWidget'
import {Config, Toast, i18n} from '../../unit/AllUnit';
import QRCode from 'react-native-qrcode-svg';
import ImageCapInset from 'react-native-image-capinsets';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletPassword from './view/WalletPassword';
import {BigNumber} from 'bignumber.js/bignumber';
import WalletAction from '../../redux/actions/WalletAction';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      showInput: false
    };
    const {address} = WalletAction.selectedAccount();
    this.address = address;
    this.coinName = ' ZVC';
    this.showAmountButton = true;

    const params = this.props.navigation.state.params;

    if (params && params.coinName) {
      this.showAmountButton = false;
    }
  }

  onSharePress = () => {}
  onInputHide = (amount = '') => {
    amount = BigNumber(amount).toFixed()
    if (isNaN(amount)) 
      amount = ''
    this.setState({showInput: false, amount})
  }
  onShowInput = () => this.setState({showInput: true})

  render() {
    const {amount, showInput} = this.state;
    let qrcode = this.address;
    if (amount > 0) {
      qrcode = this.address + '?value=' + amount
    }

    return (
      <View style={styles.container}>
        <NavBar
          title={i18n.wallet_receipt}
          color='#fff'
          backgroundColor='rgba(0,0,0,0)'
          hideLine/>

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

          <Text style={styles.zv}>ZV-Wallet</Text>
          <QRCode size={200} value={qrcode}></QRCode>
          <Text style={styles.zv}>{this.address}</Text>

          <Button
            style={styles.copy}
            onPress={() => {
            Clipboard.setString(this.address);
            Toast(i18n.reload_copySuccess)
          }}>{i18n.reload_copyAddress}</Button>

          {amount.length > 0 && <Text style={styles.amount}>{i18n.wallet_receipt_please} {amount}{this.coinName}</Text>}
          <View style={styles.container}></View>

          {this.showAmountButton && <Button style={styles.button} onPress={this.onShowInput}>{i18n.wallet_receipt_assign}</Button>}

        </ImageCapInset>

        {showInput && <WalletPassword
          secureTextEntry={false}
          title={i18n.wallet_receipt_assignInfo}
          placeholder={i18n.wallet_receipt_assignInfo}
          onHide={this.onInputHide}/>}

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
    width: Config.width - 16,
    height: Config.height - 62 - Config.statusBarHeight,
    alignItems: 'center',
    marginTop: 10 + Config.navBarHeight - topBgHeight
  },
  zv: {
    fontSize: 13,
    color: '#333',
    margin: 10,
    marginTop: 22,
    paddingHorizontal: 20
  },
  copy: {
    width: Config.width - 40,
    backgroundColor: '#fff',
    fontSize: 14,
    color: Config.appColor,
    marginBottom: 20,
    marginTop: 0
  },
  amount: {
    fontSize: 16,
    color: Config.appColor,
    marginHorizontal: 15
  },
  button: {
    marginBottom: 50,
    width: Config.width - 50
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({}))(Page)