import {MinerInfoUpdate, MinerInfoInit} from '../types/Types';
import WalletAction from './WalletAction';
import {chainRequest, i18n} from '../../unit/AllUnit';

function UpdateMinerInfo(data = {}) {
  data.type = MinerInfoUpdate;
  return data
}

function initMinerInfo() {
  return {type: MinerInfoInit}
}

_address = '';

function updateMinerInfoAction() {
  return dispatch => {
    let {address} = WalletAction.selectedAccount();
    if (_address != address) {
      _address = address;
      dispatch(initMinerInfo())
    }
    chainRequest({
      "method": "Gzv_minerInfo",
      "params": [address, address]
    }).then(data => {
      if (!data.result) {
        return;
      }

      let stakeAll = stakeV = stakeP = refundAll = refundV = refundP = frozenHeightV = frozenHeightP = refundHeightV = refundHeightP = 0;
      let selfStakeV = selfStakeP = 0;
      let miner_statusV = miner_statusP = '--';
      const {details, overview} = data.result;

      for (const item in details) {
        if (details.hasOwnProperty(item)) {
          const element = details[item];
          if (item == address) {
            element.forEach(stake => {
              if (stake.stake_status == 'frozen' && stake.m_type == 'proposal') {
                refundP = stake.value;
                refundHeightP = stake.update_height;
              } else if (stake.stake_status == 'frozen' && stake.m_type == 'verifier') {
                refundV = stake.value;
                refundHeightV = stake.update_height;
              } else if (stake.stake_status == 'normal' && stake.m_type == 'proposal') {
                selfStakeP = stake.value;
              } else if (stake.stake_status == 'normal' && stake.m_type == 'verifier') {
                selfStakeV = stake.value;
              }
            });
          }
        }
      }

      overview && overview.forEach(item => {
        if (item.type == 'proposal node') {
          stakeP = item.stake;
          miner_statusP = item.miner_status;
          if (miner_statusP == 'frozen') {
            frozenHeightP = item.status_update_height
          }
        } else if (item.type == 'verify node') {
          stakeV = item.stake;
          miner_statusV = item.miner_status;
          if (miner_statusV == 'frozen') {
            frozenHeightV = item.status_update_height
          }
        }
      });

      const minerStatusConfig = {
        'normal': i18n.miner_active,
        'prepared': i18n.miner_prepare,
        'frozen': i18n.miner_frozen,
        '--': i18n.miner_normal
      };
      miner_statusP = minerStatusConfig[miner_statusP] || miner_statusP;
      miner_statusV = minerStatusConfig[miner_statusV] || miner_statusV;

      refundAll = refundP + refundV;
      stakeAll = stakeP + stakeV;

      dispatch(UpdateMinerInfo({
        stakeAll,
        stakeV,
        stakeP,
        refundAll,
        refundV,
        refundP,
        miner_statusV,
        miner_statusP,
        frozenHeightV,
        frozenHeightP,
        refundHeightV,
        refundHeightP,
        selfStakeP,
        selfStakeV
      }))
    });
  }

}

function updateGroupAction() {
  return dispatch => {
    const {address} = WalletAction.selectedAccount();
    chainRequest({"method": "Gzv_groupCheck", "params": [address]}).then(data => {
      if (!data.result) {
        return;
      }

      const {joined_living_groups, current_group_routine} = data.result;
      const groupCount = joined_living_groups.length;
      const groupSelected = current_group_routine.selected
        ? i18n.miner_selected
        : i18n.miner_unSelected;
      dispatch(UpdateMinerInfo({groupCount, groupSelected}))
    })
  }
}

function updateBlockHeightAction() {
  return dispatch => {

    chainRequest({"method": "Gzv_blockHeight"}).then(data => {
      if (!data.result) {
        return;
      }
      let blockHeight = data.result;
      let blockHeightTime = (new Date).getTime();
      _blockHeight = blockHeight;
      _blockHeightTime = blockHeightTime;
      dispatch(UpdateMinerInfo({blockHeight, blockHeightTime}))
    })
  }
}

export default {
  updateMinerInfoAction,
  updateGroupAction,
  updateBlockHeightAction,

  getTimeMinute,
  getTimeHour,
  getTimeDay
}

let _blockHeight = 0;
let _blockHeightTime = 0;
function getBlockOffset(blockHeight) {
  let now = (new Date).getTime();
  const nowHeight = (now - _blockHeightTime) / 1000 / 3 + _blockHeight;
  let offset = nowHeight - blockHeight;
  if (offset < 0) {
    offset = 0;
  }
  return offset;
}

function getTimeMinute(blockHeight) {
  if (!_blockHeight || !blockHeight) {
    return ''
  }
  let minute = getBlockOffset(blockHeight) / 20 | 0;
  return ` ( ${minute}${i18n.my_min} )`
}

function getTimeHour(blockHeight) {

  if (!_blockHeight || !blockHeight) {
    return ''
  }

  let hour = getBlockOffset(blockHeight) / 20 / 60 | 0;
  return ` ( ${hour}${i18n.my_hour} )`
}

function getTimeDay(blockHeight) {

  if (!_blockHeight || !blockHeight) {
    return ''
  }

  let day = getBlockOffset(blockHeight) / 20 / 60 /24 | 0;
  return ` ( ${day}${i18n.fortune_day} )`
}

