import {NavigationActions, StackActions} from 'react-navigation';
import * as Config from './Config';
import {PermissionsAndroid} from 'react-native';
import {Linking} from 'react-native';

let _navigator;
// let lastRouteName;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  const key = 'routeName';
  _navigator.dispatch(NavigationActions.navigate({routeName, params}));
}

function resetRoot(routeName) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName})]
  });
  _navigator.dispatch(resetAction)
}

function popToRoot(params) {
  _navigator.dispatch(StackActions.popToTop());
}

function deleteRoute(routeName) {
  const timeout = setTimeout(() => {
    if (typeof routeName == 'string') {
      _navigator.dispatch({type: 'DeleteRoute', routeName});
    } else {
      routeName.forEach(route => {
        _navigator.dispatch({type: 'DeleteRoute', route});
      });
    }
    clearTimeout(timeout)
  }, 1000);
}

function toQrcode(callBack) {
  if (Config.isIos) {
    navigate('ScannerQRCode', {callBack})
    return
  }

  //安卓申请权限
  PermissionsAndroid
    .request(PermissionsAndroid.PERMISSIONS.CAMERA)
    .then(data => {
      if (data) {
        navigate('ScannerQRCode', {callBack})
      }
    })
}

function pop(num) {
  _navigator.dispatch(StackActions.pop(num));
}

function toExplorer(type = '', value) {
  Linking.openURL(`https://explorer.zvchain.io/?${ (new Date).getTime()}#/${Config.WEB_KEY}/${type}/${value}`)
}

function switchToOffChain(routeName) {
  return;
}

function switchToOnChain(routeName) {
  return;
}

export default {
  navigate,
  setTopLevelNavigator,
  resetRoot,
  popToRoot,
  deleteRoute,
  toQrcode,
  pop,
  toExplorer,
  switchToOffChain,
  switchToOnChain
};