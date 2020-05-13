import WalletAction from "../redux/actions/WalletAction";
import Confirm from '../page/Wallet/view/Confirm';
import {Base64} from 'js-base64';
import {BigNumber} from 'bignumber.js/bignumber';
import React, {Component} from 'react';
import {NativeModules, AsyncStorage, Clipboard} from 'react-native';
import {
  ShowText,
  chainRequest,
  fullUrlRequest,
  UMAnalyticsModule,
  i18n,
  UserData,
  TxManager,
  Toast
} from './AllUnit';
import NavigationService from "./NavigationService";
const WalletModule = NativeModules.Wallet;

function sign({
  data = '',
  target = '',
  value = 0,
  gas = 500,
  gasprice = 500,
  tx_type = TX_TYPE_TRANSEFER,
  extra_data = ''
}) {

  const account = WalletAction.selectedAccount();
  const {sk, nonce} = account;
  const source = account.address;

  let dataHex = '';
  let dataBase64 = '';
  let extra_dataHex = '';
  let extra_dataBase64 = '';

  if (data) {
    dataHex = ShowText.stringToByteString(Base64.decode(data));
    dataBase64 = data
  }
  if (extra_data) {
    extra_dataHex = ShowText.stringToByteString(Base64.decode(extra_data));
    extra_dataBase64 = extra_data
  }

  const signValue = BigNumber(value)
    .times(1e9)
    .toFixed(0)
    .toString()

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

      if (data && data.error) {
        Toast(data.error.message || 'error');
        UMAnalyticsModule.onEvent('tx_fail_' + tx_type);
        return;
      } else if (data.result) {
        UMAnalyticsModule.onEvent('tx_success_' + tx_type);
        NavigationService.navigate('CommonSuccess');
        TxManager.add({
          type: tx_type,
          source: source,
          target: target,
          value: value,
          curTime: (new Date).getTime(),
          hash: data.result,
          localStatus: 1
        });
      } 



    }).catch(err => {})
  })

}

export default QRSign = (url) => {

  fullUrlRequest(url, {}, 'GET').then((res = {}) => {
    if (!res) {
      return;
    }

    let {
      target,
      value,
      gas_limit,
      gas_price,
      type,
      data,
      extra_data
    } = res;

    if (type == undefined || type < 0) {
      return;
    }
    if (gas_limit < 500) {
      gas_limit = 10000;
    }
    if (gas_price < 500) {
      gas_price = 500;
    }
    const account = WalletAction.selectedAccount();
    let title = i18n['wallet_tx_type' + type] || i18n.unknown_tx;
    console.warn(type, gas_limit, title, account.address);

    UserData.rootTopViewRefShow(<Confirm
      title={title}
      info={title}
      value={value}
      target={target}
      gas={gas_limit * gas_price}
      address={account.address}
      onPress={() => {
      UserData.rootTopViewRefHide();
      UserData.authWalletPassword(() => {
        sign({
          target,
          value,
          tx_type: type,
          gas: gas_limit,
          gasprice: gas_price,
          data,
          extra_data
        });
      })
    }}
      onHide={UserData.rootTopViewRefHide}/>)
  })

}
