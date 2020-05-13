import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  ImageBackground,
  ScrollView,
  Clipboard
} from 'react-native';
import {NavBar, Button} from '../../../widget/AllWidget'
import {Config, i18n, Toast, NavigationService} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wallet: {},
      showButton: false
    };
  }

  onPress = () => {
    if (!this.state.showButton) {
      return;
    }
    NavigationService.navigate('CreateWalletConfirm', {wallet: this.state.wallet})
  }

  componentDidMount() {
    this.timerout = setTimeout(() => {
      clearTimeout(this.timerout)
      this.setState({wallet: this.props.wallet, showButton: true});
      this
        .props
        .updateWallet({
          data: {
            aesSK: '',
            mnemonic: '',
            usedIndex: 0,
            selectedIndex: 0,
            accounts: []
          }
        })
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timerout)
  }

  render() {
    let wallet = this.state.wallet;
    if (!wallet.mnemonic) {
      wallet = this.props.wallet;
    }

    const {name, mnemonic, accounts} = wallet;
    if (!mnemonic) {
      return null;
    }
    let mnemonic_list = [];
    let sk = '';
    if (mnemonic && mnemonic.length > 0) {
      mnemonic_list = mnemonic.split(' ')
    }
    if (accounts && accounts.length > 0) {
      sk = accounts[0].sk;
    }

    return (
      <View style={styles.container}>

        <NavBar
          title=' '
          color='#fff'
          backgroundColor='rgba(0,0,0,0)'
         />

        <ImageBackground
          source={require('../../../img/wallet/bg_backup.png')}
          resizeMethod='auto'
          style={styles.bg}>
          <Text style={styles.white_title}>{i18n.wallet_add_backuptitle}</Text>
          <Text style={styles.red}>{i18n.wallet_add_backupInfo}</Text>
        </ImageBackground>

        <View style={styles.view}>
          <Text style={styles.title}>{i18n.wallet_add_name}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>

        <View style={styles.line}/>

        <View style={styles.skV}>
          <Text style={styles.title}>{i18n.wallet_add_sk}</Text>
          <Text style={styles.name}>{sk}</Text>
          <Button
            style={styles.copyBtn}
            onPress={() => {
            Clipboard.setString(sk);
            Toast(i18n.reload_copySuccess)
          }}>{i18n.wallet_add_copy}</Button>
        </View>

        <View>
          <View style={styles.row}>
            <View style={styles.redBlock}></View>
            <Text style={styles.title}>{i18n.wallet_add_mnemonic}</Text>
          </View>
          <View style={styles.words}>
            {mnemonic_list.map((item, k) => {
              return <Text key={k} style={styles.word}>{item}</Text>
            })}
          </View>

        </View>

        <Button onPress={this.onPress} style={styles.button}>{i18n.wallet_add_next}</Button>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  bg: {
    marginTop: -Config.navBarHeight - 2,
    width: Config.width,
    height: 213
  },

  white_title: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 62 + Config.statusBarHeight,
    paddingHorizontal: 25
  },
  title: {
    fontSize: 13,
    color: '#333',
    fontWeight: 'bold'
  },
  red: {
    fontSize: 13,
    // color: Config.appColor,
    color: '#D84D42',
    marginTop: 10,
    paddingHorizontal: 25,
    lineHeight:16
  },
  view: {
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  name: {
    fontSize: 13,
    color: '#666',
    paddingTop: 10
  },
  line: {
    width: Config.width - 50,
    height: 0.5,
    backgroundColor: '#D5D5D5',
    alignSelf: 'center'
  },
  skV: {
    height: 113,
    padding: 15
  },
  copyBtn: {
    alignSelf: 'flex-end',
    margin: 0,
    marginTop: 0,
    width: 75,
    height: 30,
    backgroundColor: '#fff',
    color: Config.appColor
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderColor: Config.bgColor,
    borderBottomWidth: 10
  },
  redBlock: {
    width: 3,
    height: 14,
    marginRight: 10,
    backgroundColor: Config.appColor
  },
  words: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 30,
    marginTop: 15
  },
  word: {
    fontSize: 14,
    color: '#999',
    marginRight: 10
  },
  button: {
    marginTop: 40
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch)
}))(Page)