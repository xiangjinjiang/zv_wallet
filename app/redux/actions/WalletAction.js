import * as types from '../types/WalletType'
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'crypto-js';
import {NativeModules, AsyncStorage, Clipboard} from 'react-native';
import {
  ShowText,
  ConstValue,
  chainRequest,
  Toast,
  i18n,
  TxManager,
  UMAnalyticsModule,
  Config,
  get,
  post
} from '../../unit/AllUnit';
import {Base64} from 'js-base64';
import {BigNumber} from 'bignumber.js/bignumber';

const {
  TX_TYPE_TRANSEFER,
  TX_TYPE_STAKEADD,
  TX_TYPE_STAKEREFUND,
  TX_TYPE_STAKEREDUCE,
  TX_TYPE_ABORT,
  TX_TYPE_CONTRACT,
  MINER_TYPE_VERIFIER,
  MINER_TYPE_PROPOSER
} = ConstValue

const WalletModule = NativeModules.Wallet;

const wallet_SAVE_KEY = 'open_wallet';
const INITIAL_WALLET = {
  mnemonic: '',
  usedIndex: 0,
  selectedIndex: 0,
  accounts: []
}

function createWalletACtion(mnemonic, password, account) {
  return {type: types.WALLET_CREATE, mnemonic, password, account}
}

function walletUpdateAction(data = {}) {
  data.type = types.WALLET_UPDATE;
  return data
}

function deleteACcountAction(index) {
  return {type: types.WALLET_DELETE_ACCOUNT, index}
}

function createAccountAction(account) {
  return {type: types.WALLET_CREATE_ACCOUNT, account}
}

function updatePasswordAction(password) {
  return {type: types.UPDATE_PASSWOED, password}
}

function updateWalletWithoutSave(data = {}) {
  data.type = types.WALLET_UPDATE_WITHOUT_SAVE;
  return data;
}

// 创建钱包
function createWallet({name, password}) {
  return dispatch => {
    WalletModule.getMnemonic((err, mnemonic) => {
      dispatch(walletUpdateAction({
        ...INITIAL_WALLET,
        mnemonic,
        name,
        password
      }));
      _createAccount({dispatch, mnemonic, index: 0, name})
    });
  }
}

// 导入钱包
function importWallet({mnemonic, password, name, callback}) {
  return dispatch => {

    _createAccount({
      dispatch,
      mnemonic,
      index: 0,
      name,
      callback: status => {
        if (status == -1) {
          callback(-1)
        } else {
          callback()
          dispatch(walletUpdateAction({mnemonic, name, password, selectedIndex: 0, usedIndex: 0}));
        }
      }
    })

  }
}

function createAccount({mnemonic, index, name}) {
  return dispatch => {
    _createAccount({dispatch, mnemonic, index, name})
  }
}

function importAccount({child, name}) {
  return dispatch => {
    WalletModule.sk2Addr(child, (err, address) => {
      if (!address) {
        Toast(i18n.wallet_skErr)
        return;
      }

      const account = {
        index: (new Date).getTime(),
        sk: child,
        address,
        name,
        isImport: true
      }
      dispatch(createAccountAction(account));
      _updateBalance(dispatch, account);
    })
  }
}

function deleteAccount({index}) {
  return dispatch => dispatch(deleteACcountAction({index}))
}

function updateWallet({data}) {
  return dispatch => dispatch(walletUpdateAction(data))
}

function _createAccount({
  dispatch,
  mnemonic,
  index = 0,
  name,
  callback
}) {
  WalletModule.getChild(mnemonic, index, (err, child) => {

    if (!child) {
      Toast(i18n.wallet_mnemonicErr)
      if (callback) {
        callback(-1)
      }
      return;
    }
    if (callback) {
      callback()
    }
    WalletModule.sk2Addr(child, (err, address) => {

      const account = {
        index: index,
        sk: child,
        address,
        name: name,
        isImport: false,
        value: '0.000000'
      }
      dispatch(createAccountAction(account))
    })
  })
}

let _currentWallet = {};
let _saveTimer;
// 存储钱包
function saveWallet(wallet) {
  if (_currentWallet == wallet) {
    return;
  }
  _currentWallet = wallet;

  if (wallet.action == types.WALLET_UPDATE_WITHOUT_SAVE) {
    return;
  }

  if (wallet.password != Config.walletPassword) {
    Config.walletPassword = wallet.password;
  }
  __save(wallet)
}

function __save(wallet) {
  clearTimeout(_saveTimer)
  _saveTimer = setTimeout(() => {
    AsyncStorage.setItem(wallet_SAVE_KEY, JSON.stringify(wallet))
  }, 1000);
}

function __decrypt(object) {
  let wallet = {};
  if (!object ) {
    return wallet;
  }

  try {
    wallet = JSON.parse(object);
  } catch (error) {
    console.warn(error);
  }
  return wallet;
}

// 初始化钱包
function initWallet(callback) {
  return dispatch => {


        AsyncStorage.getItem(wallet_SAVE_KEY, (error, object) => {
          if (!error && object) {
            const wallet = __decrypt(object);

            dispatch(walletUpdateAction(wallet))
            if (wallet.mnemonic) {
              callback(true)
            } else {
              callback(false)
            }
          } else {
            callback(false)
          }
        })
      
  }
}

export default {
  createWallet,
  importWallet,
  updateWallet,
  updateWalletWithoutSave,
  createAccount,
  importAccount,
  deleteAccount,

  initWallet,
  saveWallet,
  SignAndPost,
  selectedAccount,
  authPassword,
  hasWallet,

  updateSelectedBalance,
  updateAllBalance,
  updateNonce
}

function hasWallet() {
  let {selectedIndex, accounts} = _currentWallet;
  if (!accounts || accounts.length == 0) {
    return false;
  }
  return true;
}

function selectedAccount() {
  let {selectedIndex, accounts} = _currentWallet;
  if (!accounts || accounts.length == 0) {
    return {}
  }
  if (accounts.length < selectedIndex + 1) {
    selectedIndex = 0;
  }

  return accounts[selectedIndex]
}

function authPassword(password) {
  if (password == selectedAccount().password) {
    return true;
  }
  return false;
}

// 更新选中账户的余额
function updateSelectedBalance() {
  return dispatch => {
    _updateBalance(dispatch, selectedAccount());
  }
}

// 更新所有账户的余额
function updateAllBalance() {
  return dispatch => {
    const {accounts} = _currentWallet;
    accounts.forEach(account => {
      _updateBalance(dispatch, account);
    });
  }
}

// 从链上获取nonce
function updateNonce(account) {
  return dispatch => {
    if (!account) {
      account = selectedAccount()
    }
    _updateNonce(dispatch, account);
  }
}

// 交易完成后 账户 nonce +1
function _noncePlus() {
  let accounts = [..._currentWallet.accounts]
  accounts[_currentWallet.selectedIndex].nonce += 1;
  updateWalletWithoutSave({accounts})
}

function _updateNonce(dispatch, account) {

  chainRequest({
    "method": 'Gzv_nonce',
    "params": [account.address]
  }).then(data => {

    if (!data.error) {
      let accounts = [..._currentWallet.accounts]
      accounts.forEach(item => {
        if (item.address == account.address && item.nonce != data.result + 1) {
          item.nonce = data.result;
        }
      });
      dispatch(updateWalletWithoutSave({accounts}))
    }
  })
}

function _updateBalance(dispatch, account) {

  chainRequest({
    "method": "Gzv_balance",
    "params": [account.address]
  }).then(data => {

    if (!data.error) {
      let accounts = [..._currentWallet.accounts]
      accounts.forEach(item => {
        if (item.address == account.address) {
          item.value = data.result;
        }
      });
      dispatch(updateWalletWithoutSave({accounts}))
    }

  })
}

const _toByte = data => {
  return String
    .fromCharCode
    .apply(null, data)
}

function SignAndPost({
  sk = '',
  source = '',
  data = '',
  target = '',
  value = 0,
  gas = 500,
  gasprice = 500,
  tx_type = TX_TYPE_TRANSEFER,
  nonce,
  extra_data = '',
  m_type,
  key, //合约部署成功后回调的key
  zrcItem,
  notSave = false
}, callback) {

  const account = selectedAccount()
  sk = sk || account.sk;
  source = source || account.address;
  nonce = nonce || account.nonce;
  target = target.trim() || account.address;

  if (tx_type == TX_TYPE_CONTRACT) {
    target = '';
  }

  let dataHex = '';
  let dataBase64 = '';
  let extra_dataHex = '';
  let extra_dataBase64 = '';

  if (m_type != undefined) {
    if (tx_type == TX_TYPE_STAKEADD) {
      data = m_type == MINER_TYPE_VERIFIER
        ? _toByte([1, 0])
        : _toByte([1, 1])
    } else {
      data = m_type == MINER_TYPE_VERIFIER
        ? _toByte([0])
        : _toByte([1])
    }
  }

  if (data) {
    dataHex = ShowText.stringToByteString(data);
    dataBase64 = Base64.encode(data)
  }
  if (extra_data) {
    extra_dataHex = ShowText.stringToByteString(extra_data);
    extra_dataBase64 = Base64.encode(extra_data)
  }

  const signValue = BigNumber(value)
    .times(1e9)
    .toFixed(0)
    .toString()

  console.warn(sk, dataHex, signValue, nonce, target, tx_type, parseInt(gas), parseInt(gasprice), extra_dataHex);

  WalletModule.signTx(sk, dataHex, signValue, nonce, target, tx_type, parseInt(gas), parseInt(gasprice), extra_dataHex, (err, sign) => {

    const params = {
      sign,
      target,
      value: BigNumber(signValue).toNumber(),
      gas_limit: parseInt(gas),
      gas_price: parseInt(gasprice),
      type: tx_type,
      nonce: nonce,
      data: dataBase64,
      extra_data: extra_dataBase64,
      source
    }

    chainRequest({"method": 'Gzv_tx', "params": [params]}).then(data => {
      console.warn(data);

      if (data.result) {
        _noncePlus();
        UMAnalyticsModule.onEvent('tx_success_' + tx_type);
        if (!notSave) {
          TxManager.add({
            type: tx_type,
            source: source,
            target: target,
            value: value,
            curTime: (new Date).getTime(),
            hash: data.result,
            localStatus: 1,
            key,
            zrcItem
          });
        }
      } else {
        UMAnalyticsModule.onEvent('tx_fail_' + tx_type);
      }

      callback(data);

    }).catch(err => {})
  })

}