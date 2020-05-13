import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import {NavBar, TopPadding, Shadow} from '../../../widget/AllWidget'
import {
  Config,
  post,
  NavigationService,
  ShowText,
  i18n,
  Toast
} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';
import {SwipeRow} from 'react-native-swipe-list-view';

const bg_color_list = [
  require('../../../img/wallet/img_wallet1.png'),
  require('../../../img/wallet/img_wallet2.png'),
  require('../../../img/wallet/img_wallet3.png'),
  require('../../../img/wallet/img_wallet4.png'),
  require('../../../img/wallet/img_wallet5.png'),
  require('../../../img/wallet/img_wallet6.png')
];

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.rowsRef = [];
    this.createAccountTime = null;
  }

  componentDidMount() {
    this
      .props
      .updateAllBalance()
  }

  onCreateAccount = () => {
    const now = new Date().getTime();
    if (now - this.createAccountTime < 1000) {
      return;
    }
    this.createAccountTime = now;
    
    const {mnemonic, usedIndex} = this.props.wallet;
    const name = 'Account ' + usedIndex
    this
      .props
      .createAccount({mnemonic, index: usedIndex, name});
  }

  onImportAccount = () => {
    NavigationService.navigate('ImportWallet')
  }

  deleteAccount = k => {
    const {accounts} = this.props.wallet;

    if (accounts.length <= 1) {
      Toast(i18n.wallet_manager_deleteErr)
    } else {
      Alert.alert('', i18n.wallet_manager_deleteInfo, [
        {
          text: i18n.my_continue,
          onPress: () => this.onDeleteAccount(k)
        }, {
          text: i18n.my_cancel
        }
      ])
    }
    this
      .rowsRef
      .map(ref => {
        ref && ref.closeRow();
      })
  }

  onDeleteAccount = (k) => {
    const {props} = this;
    let {selectedIndex, accounts} = this.props.wallet;
    const newAccounts = [...accounts];
    newAccounts.splice(k, 1);
    if (selectedIndex > k) {
      selectedIndex = selectedIndex - 1;
    }
    if (selectedIndex == k) {
      selectedIndex = 0;
    }
    if (selectedIndex <= 0) {
      selectedIndex = 0;
    }
    props.updateWallet({
      data: {
        selectedIndex,
        accounts: newAccounts
      }
    })
    Toast(i18n.wallet_manager_deleted);
    this.setState({})

  }

  onItemPress = k => {
    const {selectedIndex} = this.props.wallet;
    if (k == selectedIndex) {
      return;
    }
    this
      .props
      .updateWallet({
        data: {
          selectedIndex: k
        }
      });
    NavigationService.pop();
  }

  renderItem = (item, k) => {
    const {selectedIndex} = this.props.wallet;
    const {name, isImport, value} = item;
    const source = bg_color_list[k % bg_color_list.length]

    return <SwipeRow
      ref={rowsRef => {
      this.rowsRef[k] = rowsRef
    }}
      rightOpenValue={-70}
      onRowPress={() => this.onItemPress(k)}>

      <View style={styles.swipeV}>
        <View style={styles.deleteV}>
          <TouchableWithoutFeedback onPress={() => this.deleteAccount(k)}>
            <Image
              source={require('../../../img/wallet/icon_delete.png')}
              style={styles.deleteImg}/>
          </TouchableWithoutFeedback>
        </View>

      </View>

      <TouchableWithoutFeedback key={k} style={styles.pressV}>
        <Shadow style={styles.shadow}>
          <View
            style={[
            styles.cell, {
              backgroundColor: selectedIndex == k
                ? 'rgba(1,1,1,0.1)'
                : '#fff'
            }
          ]}>
            <Image source={source} style={styles.logo}/>
            <Text style={styles.name}>{name}</Text>
            <View>
              {isImport && <Text style={styles.imported}>{i18n.wallet_account_imported}</Text>}
              <Text style={styles.zv}>{ShowText.toFix(value, 6, true) + ' ZVC'}</Text>
            </View>
          </View>
        </Shadow>
      </TouchableWithoutFeedback>
    </SwipeRow>
  }

  render() {
    const {accounts} = this.props.wallet;

    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_account}/>
        <TopPadding></TopPadding>

        <ScrollView showsVerticalScrollIndicator={false}>

          {accounts.map(this.renderItem)}

        </ScrollView>

        <View style={styles.buttonsV}>
          <TouchableOpacity style={styles.container} onPress={this.onCreateAccount}>
            <View style={styles.button}>
              <Image source={require('../../../img/wallet/create_account.png')}/>
              <Text style={styles.buttonTitle}>{i18n.wallet_account_create}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.container} onPress={this.onImportAccount}>
            <View style={styles.button}>
              <Image source={require('../../../img/wallet/import_account.png')}/>
              <Text style={styles.buttonTitle}>{i18n.wallet_account_import}</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    )
  }

}

let marginBottom = Config.statusBarHeight > 20
  ? Config.statusBarHeight - 20
  : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  pressV: {
    width: Config.width,
    backgroundColor: '#fff',
    height: 75
  },
  shadow: {
    width: Config.width - 16,
    height: 75,
    marginHorizontal: 8
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Config.width - 30,
    margin: 7,
    marginLeft: 7,
    marginRight: 14,
    flex: 1,
    borderRadius: 4
  },
  logo: {
    margin: 10
  },
  name: {
    fontSize: 14,
    color: '#666',
    flex: 1
  },
  imported: {
    color: '#999',
    fontSize: 12,
    marginBottom: 6,
    marginTop: -2,
    alignSelf: "flex-end",
    marginRight: 10
  },
  zv: {
    fontSize: 16,
    color: Config.appColor,
    marginRight: 10
  },
  buttonsV: {
    height: 49,
    flexDirection: "row",
    alignItems: 'center',
    marginBottom,
    borderTopWidth: 1,
    borderColor: '#D8D8D8'
  },
  button: {
    height: 49,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTitle: {
    color: "#666",
    fontSize: 13,
    marginLeft: 6
  },
  line: {
    width: 1,
    height: 29,
    backgroundColor: '#D8D8D8'
  },
  swipeV: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  deleteV: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  deleteImg: {
    margin: 30
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  createAccount: bindActionCreators(WalletAction.createAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch),
  updateAllBalance: bindActionCreators(WalletAction.updateAllBalance, dispatch)
}))(Page)
