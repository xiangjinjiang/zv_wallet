import * as types from '../types/WalletType'
import {Toast, i18n} from '../../unit/AllUnit';

const INITIAL_STATE = {
  aesSK: '',
  mnemonic: '',
  usedIndex: 0,
  selectedIndex: 0,
  password: '',
  accounts: []
}

/**

 const account = {
  index: 0,
  sk: '',
  address: '',
  name: '',
  isImport: false,
  value:0,
  nonce:0,
}
 */

export default function reducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case types.WALLET_CREATE:
      return {
        ...state,
        status: action.type
      }
    case types.WALLET_UPDATE:

      return {
        ...state,
        ...action
      }
    case types.WALLET_UPDATE_WITHOUT_SAVE:

      return {
        ...state,
        ...action
      }
    case types.WALLET_CREATE_ACCOUNT:
      {
        let usedIndex = state.usedIndex;
        if (action.account.isImport == false) {
          usedIndex += 1;
        }

        let isImported = false;
        state
          .accounts
          .forEach(item => {
            if (item.sk == action.account.sk) {
              isImported = true;
            }
          });
        if (isImported) {
          Toast(i18n.wallet_skExist)
          return {
            ...state,
            usedIndex
          };
        }

        let accounts = [action.account];
        if (action.account.index != 0) {
          accounts = [
            ...state.accounts,
            action.account
          ];
        } else {
          state.accounts.map(ac => {
            if (ac.isImport) {
              accounts.push(ac);
            }
          })
        }

        return {
          ...state,
          accounts,
          usedIndex
        }
      }
    case types.WALLET_DELETE_ACCOUNT:
      {
        const accounts = [...state.accounts];
        const index = action.index;
        let key = -1;
        accounts.forEach((item, k) => {
          if (item.index == index) {
            key = k
          }
        })
        if (key != -1) {
          accounts.splice(key, 1)
        } else {
          Toast(i18n.wallet_deleteAccountErr)
        }

        return {
          ...state,
          accounts,
          selectedIndex: 0
        }
      }

    case types.UPDATE_PASSWOED:
      return {
        ...INITIAL_STATE
      }
    default:
      return state;
  }
}
