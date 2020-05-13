import {ZRC_UPDATE, ZRC_UPDATE_WITHOUT_SAVE} from '../types/Types';

const INITIAL_STATE = {
  status: '', //请求的状态
  zrcList: [],
  selectedIndex: 0
};

/*

{
address:'',
value:'',
decimal,
img
}

*/

// 不同类别的事件使用switch对应处理过程
export default function reducer(state = INITIAL_STATE, action) {
  action.status = action.type;
  console.warn(action);

  switch (action.type) {
    case ZRC_UPDATE:
      return {
        ...state,
        ...action
      }
    case ZRC_UPDATE_WITHOUT_SAVE:
      return {
        ...state,
        ...action
      }

    default:
      return state;
  }
}
