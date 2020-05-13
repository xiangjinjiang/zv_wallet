import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers/index'
import WalletAction from '../actions/WalletAction';
import ZrcAction from '../actions/ZrcAction';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),)

  store.subscribe(() => {
    WalletAction.saveWallet(store.getState().wallet);
    ZrcAction.saveZrc(store.getState().zrc);
  })
  return store;
}
