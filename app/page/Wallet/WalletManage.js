import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  Clipboard
} from 'react-native';
import {NavBar, CommonCell, TopPadding} from '../../widget/AllWidget'
import {
  Config,
  UserData,
  i18n,
  Toast,
  NavigationService,
  CopyUnit
} from '../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../redux/actions/WalletAction';
import WalletPassword from './view/WalletPassword';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showInput: false
    };
    this.secureTextEntry = true;
  }

  onNameChange = (name = '') => {
    this.name = name;
    if (name.length) {
      const {props} = this;
      const {mnemonic, selectedIndex, accounts} = this.props.wallet;
      Toast(i18n.wallet_manager_changeSuccess)
      accounts[selectedIndex].name = name
      props.updateWallet({data: {
          accounts
        }})
    }
    this.setState({showInput: false})
  }

  onPwd2Sk = () => {
    const {sk} = WalletAction.selectedAccount();
    CopyUnit.copyString(sk, true);
    this.setState({showInput: false});
  }

  onPwd2Memonic = () => {
    const {mnemonic} = this.props.wallet;
    CopyUnit.copyString(mnemonic, true);
    this.setState({showInput: false});
  }

  onShowInput = (title, placeholder, callback) => {
    this.inputTitle = title
    this.inputPlaceholder = placeholder
    this.onInputHide = callback;
    this.setState({showInput: true})
  }

  onPress = title => {
    const {accounts} = this.props.wallet;
    this.secureTextEntry = true;
    const {name, sk} = WalletAction.selectedAccount();
    if (!sk) {
      Toast('Error');
      return;
    }

    if (title == i18n.wallet_manager_changeName) {
      this.secureTextEntry = false;
      this.onShowInput(i18n.wallet_manager_changeName, name, this.onNameChange);
    } else if (title == i18n.wallet_manager_exportSk) {
      UserData.authWalletPassword(this.onPwd2Sk);
    } else if (title == i18n.wallet_manager_exportMnemonic) {
      UserData.authWalletPassword(this.onPwd2Memonic);
    } else if (title == i18n.wallet_manager_deleteAccount) {

      if (accounts.length <= 1) {
        Toast(i18n.wallet_manager_deleteErr)
      } else {
        Alert.alert('', i18n.wallet_manager_deleteInfo, [
          {
            text: i18n.my_continue,
            onPress: () => UserData.authWalletPassword(this.onDeleteAccount)
          }, {
            text: i18n.my_cancel
          }
        ])
      }
    }
  }

  onDeleteAccount = () => {
    const {props} = this;
    const {selectedIndex, accounts} = this.props.wallet;
    const newAccounts = [...accounts];
    newAccounts.splice(selectedIndex, 1)
    props.updateWallet({
      data: {
        selectedIndex: 0,
        accounts: newAccounts
      }
    })
    Toast(i18n.wallet_manager_deleted)
    NavigationService.pop();
  }

  render() {
    const {showInput} = this.state

    const const_data = [
      {
        left: i18n.wallet_manager_changeName,
        right: WalletAction
          .selectedAccount()
          .name,
        arrow: true
      }, {
        left: i18n.wallet_manager_exportSk,
        right: '',
        arrow: true
      },
    ];
    const exportMnemonic = {
      left: i18n.wallet_manager_exportMnemonic,
      right: '',
      arrow: true
    };
    const deleteAccount = {
      left: i18n.wallet_manager_deleteAccount,
      right: '',
      arrow: true
    };

    const { isImport } = WalletAction.selectedAccount();
    if (!isImport) {
      const_data.push(exportMnemonic);
    }
    const_data.push(deleteAccount);
    
    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_my_accountManager}/>
        <TopPadding></TopPadding>
        {const_data.map((item, key) => {
          return <TouchableOpacity onPress={() => this.onPress(item.left)} key={key}>
            <CommonCell {...item}/>
          </TouchableOpacity>
        })}

        {showInput && <WalletPassword
          secureTextEntry={this.secureTextEntry}
          title={this.inputTitle}
          placeholder={this.inputPlaceholder}
          onHide={this.onInputHide}/>}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  deleteAccount: bindActionCreators(WalletAction.deleteAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch)
}))(Page)