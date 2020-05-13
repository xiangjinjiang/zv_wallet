import {combineReducers} from 'redux'
import wallet from './WalletReducer';
import minerInfo from './MinerInfoReducer';
import zrc from './ZrcReducer';

const rootReducer = combineReducers({
  wallet,
  minerInfo,
  zrc
})

export default rootReducer; //导出，作为统一入口