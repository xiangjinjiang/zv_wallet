import {get, post, chainRequest, fullUrlRequest} from './fetchUnit';
import {AsyncStorage} from 'react-native';
const JSONbig = require('json-bigint');

const max_save_time = 1000 * 60 * 20;
const max_pack_time = 1000 * 60 * 10;
const tx_manager_save_key = 'txManagerSaveKey'
let __timer = null;
let __statusUpdateCallback = null;
let __zrcAddCallback = null;
let _paddingList = [];

/*

      "type": 0,
      "hash": "0x3174334e53a7f634d2f20958e1bff94bd04ce9573915babde03f2831ccd23859",
      "blockHash": "0x0ffb8d406bd5ba468c21c524f14507496c2b08a66b3f3def3446a6dac7232178",
      "source": "zv01cf40d3a25d0a00bb6876de356e702ae5a2a379c95e77c5fd04f4cc6bb680c0",
      "target": "zvd4d108ca92871ab1115439db841553a4ec3c8eddd955ea6df299467fbfd0415e",
      "value": 501,
      "curTime": 1567493904000,
      localStatus:1,    // 1 打包中   2 确认中
      
*/

function saveToLocal() {
  AsyncStorage.setItem(tx_manager_save_key, JSONbig.stringify(_paddingList))
}

function initPaddingList(zrcAddCallback) {
  __zrcAddCallback = zrcAddCallback;
  AsyncStorage.getItem(tx_manager_save_key, (error, obj) => {
    if (error || !obj) {
      return;
    }
    _paddingList = JSONbig.parse(obj);
    console.warn(_paddingList);
    if (_paddingList && _paddingList.length) {
      checkTimer();
    }
  })
}

function add(tx) {
  _paddingList.push(tx);
  checkTimer();
  saveToLocal();
}

function checkTimer() {
  if (!_paddingList || !_paddingList.length) {
    clearInterval(__timer);
    __timer = null;
    return;
  }

  let allStatus2 = true;
  _paddingList.forEach(tx => {
    if (tx.localStatus != 2) {
      allStatus2 = false;
    }
  })

  if (allStatus2) {
    clearInterval(__timer)
    __timer = null;
    return;
  }

  if (!__timer) {
    __timer = setInterval(() => {
      checkTimer();
      getTxListReceipt();
    }, 5 * 1000);
  }

}

function getTxListReceipt() {

  _paddingList.forEach(tx => {

    const {localStatus, hash,status} = tx;
    if (localStatus == 2 || status) {
      return;
    }

    chainRequest({method: "Gzv_txReceipt", params: [hash]}).then(e => {
      if (!e || !e.result || !e.result.Receipt) {
        return;
      }

      const {status, contractAddress} = e.result.Receipt;
      if (tx.zrcItem) {
        __zrcAddCallback && __zrcAddCallback({
          address: contractAddress,
          ...tx.zrcItem
        });
      }
      if (tx.key && contractAddress) { //是通过在ide上扫码部署的合约
        _keyContractCall(tx.key, contractAddress)
      }

      if (status) {
        tx.status = status;
      } else {
        tx.localStatus = 2;
        __statusUpdateCallback && __statusUpdateCallback();
      }

      saveToLocal();
    })

  })
}

function _keyContractCall(key, address_link) {
  fullUrlRequest('https://ide.zvchain.io/sendres', {
    error_msg: '',
    data: {
      key,
      address_link
    },
    code: 0
  })
}

function getPaddingTxList(list, type, address, statusUpdateCallback, target) {
  let needDeleteIndex = -1;

  _paddingList.forEach((item, idx) => {
    if (needDeleteIndex >= 0) {
      return;
    }

    if (item.zrcItem && item.localStatus == 1) {  // 代币未添加至列表
      
      return;
    }

    if ((new Date).getTime() - item.curTime > max_save_time) {
      needDeleteIndex = idx;
      return;
    }

    list.forEach(tx => {
      if (tx.hash == item.hash || tx.txHash == item.hash) {
        needDeleteIndex = idx;
      }
    });
  });

  if (needDeleteIndex >= 0) {
    _paddingList.splice(needDeleteIndex, 1);
    saveToLocal();
    return getPaddingTxList(list, type, address, statusUpdateCallback);
  }

  __statusUpdateCallback = statusUpdateCallback;

  let returnList = [];
  _paddingList.forEach(item => {
    if (txShouldReturn(item, type, address, target)) {
      returnList.push(item);
    }
  })

  console.warn('returnList === ', returnList, _paddingList);

  return returnList;
}

function txShouldReturn(tx, type, address, target) { //target 判断合约地址

  if (tx.source != address) {
    return false;
  }

  if (type == 1 ) { //&& (tx.type <= 1)  类型为全部的时候 所有交易都返回
    //
  } else if (type == 2 && (tx.type == 0 && tx.target == address)) {
    //
  } else if (type == 3 && (tx.type == 0 && tx.source == address)) {
    //
  } else if (type == 4 && (tx.type == 3 && tx.target == address)) {
    //
  } else if (type == 5 && (tx.type == 3 && tx.target != address)) {
    //
  } else if (type == 10 && tx.type == 2 && tx.target == target) {
    //
  } else if (type == 12 && (tx.type == 2 && tx.source == address && tx.target == target)) {
    //
  } else {
    return false;
  }
  return true;
}

export default {
  add,
  getPaddingTxList,
  initPaddingList
};