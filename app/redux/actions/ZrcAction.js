import {ZRC_UPDATE, ZRC_UPDATE_WITHOUT_SAVE} from '../types/Types';
import WalletAction from './WalletAction';
import {chainRequest, i18n, fullUrlRequest, Config, NavigationService} from '../../unit/AllUnit';
const JSONbig = require('json-bigint');
import {AsyncStorage} from 'react-native';
import {BigNumber} from 'bignumber.js/bignumber';

const zrc_save_key = 'zrc'

function updateZrcAction(data = {}) {
  data.type = ZRC_UPDATE;
  return data
}

function updateZrcActionWithoutSave(data = {}) {
  data.type = ZRC_UPDATE_WITHOUT_SAVE;
  return data
}

let _currentZrc = {};
let _saveTimer;
// 存储钱包
function saveZrc(zrc) {

  if (_currentZrc == zrc) {
    return;
  }
  _currentZrc = zrc;

  if (zrc.status != ZRC_UPDATE) {
    return;
  }
  __save(zrc)

}

function __save(zrc) {
  zrc
    .zrcList
    .forEach(item => {
      if (isNaN(item.value) || !item.value) {
        item.value = 0;
      }
    })

  clearTimeout(_saveTimer)
  _saveTimer = setTimeout(() => {
    AsyncStorage.setItem(zrc_save_key, JSONbig.stringify(zrc))
  }, 1000);
}

function initZrc() {

  return dispatch => {
    AsyncStorage.getItem(zrc_save_key, (error, obj) => {
      if (error || !obj) {
        return;
      }

      zrc = JSONbig.parse(obj);

      dispatch(updateZrcActionWithoutSave(zrc))

    })
  }
}

export default {
  updateAllValue,
  updateValue,
  saveZrc,
  initZrc,
  selectedZrc,
  isShowAdd,

  addZrc,
  deleteZrc,
  toTopZrc,
  updateZrc
}

function updateZrc(zrc) {
  return dispatch => {
    dispatch(updateZrcAction(zrc))
  }
}

function selectedZrc() {
  let {selectedIndex, zrcList} = _currentZrc;
  if (!zrcList || zrcList.length == 0) {
    return {}
  }
  if (zrcList.length < selectedIndex + 1) {
    selectedIndex = 0;
  }

  return zrcList[selectedIndex]
}

function isShowAdd(zrc) {
  if (!zrc || !zrc.address) {
    return false;
  }
  let isShow = true;
  _currentZrc
    .zrcList
    .forEach(item => {
      if (item.address == zrc.address) {
        isShow = false;
      }
    })
  return isShow;
}

function addZrc(zrcItem) {

  return dispatch => {

    let isRepet = false;
    _currentZrc
      .zrcList
      .forEach(zrc => {
        if (zrc.address == zrcItem.address) {
          isRepet = true;
        }
      })

    if (isRepet) {
      return;
    }

    const zrcList = [
      ..._currentZrc.zrcList,
      zrcItem
    ]
    dispatch(updateZrcAction({zrcList}));

    if (zrcItem.isCreated === true) {} else {
      _updateZrc(dispatch, zrcItem);
    }

  }
}

function deleteZrc(index) {
  return dispatch => {
    const zrcList = [..._currentZrc.zrcList];
    zrcList.splice(index, 1);
    dispatch(updateZrcAction({zrcList}))
  }
}

function toTopZrc(zrcItem) {
  return dispatch => {
    let index = 0;
    _currentZrc
      .zrcList
      .forEach((item, ind) => {
        if (item.address == zrcItem.address) {
          index = ind;
        }
      })

    const zrcList = [
      zrcItem, ..._currentZrc.zrcList
    ];
    zrcList.splice(index + 1, 1);
    dispatch(updateZrcAction({zrcList}))
  }
}

function updateAllValue() {
  return dispatch => {
    const zrcList = _currentZrc.zrcList;
    zrcList.forEach(zrcItem => {
      _updateZrc(dispatch, zrcItem);
    });
  }
}

function updateValue() {
  return dispatch => {
    const zrcItem = selectedZrc();
    _updateZrc(dispatch, zrcItem);

  }
}

function _updateZrc(dispatch, zrcItem) {
  const {address} = WalletAction.selectedAccount();
  if (!address || !zrcItem.address) {
    return;
  }
  const key = 'balanceOf@' + address;
  chainRequest({
    "method": 'Gzv_queryAccountData',
    "params": [zrcItem.address, key, 1]
  }).then(data => {
    let value = 0;
    let valueChanged = false;

    if (data.result && data.result.length) {
      value = data.result[0].value;
    }

    let zrcList = [..._currentZrc.zrcList];
    zrcList.forEach(item => {
      if (!zrcItem.decimal) {
        return;
      }

      if (item.address == zrcItem.address) {
        let decimalValue = BigNumber(value).div(Math.pow(10, zrcItem.decimal));
        if (item.value != decimalValue) {
          item.value = decimalValue;
          valueChanged = true;
        }

      }
    });
    if (valueChanged) {
      dispatch(updateZrcAction({zrcList}));
    }
  })
}
