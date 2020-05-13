import {MinerInfoUpdate, MinerInfoInit} from '../types/Types';

const INITIAL_STATE = {
  status: '', //请求的状态
  blockHeight: 0,
  blockHeightTime: 0,
  address: '',
  stakeAll: 0,
  stakeV: 0,
  stakeP: 0,
  selfStakeV: 0,
  selfStakeP:0,
  refundAll: 0,
  refundV: 0,
  refundP: 0,
  miner_statusV: '',
  miner_statusP: '',
  groupCount: 0,
  groupSelected: '',
  frozenHeightV: 0,
  frozenHeightP: 0,
  refundHeightV: 0,
  refundHeightP: 0
};

// 不同类别的事件使用switch对应处理过程
export default function reducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case MinerInfoUpdate:
      return {
        ...state,
        ...action
      }
    case MinerInfoInit:
      return INITIAL_STATE;

    default:
      return state;
  }
}
