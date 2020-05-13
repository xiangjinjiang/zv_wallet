import {AsyncStorage, Alert} from 'react-native';
import * as Config from './Config';
import NavigationService from './NavigationService';
import TouchID from 'react-native-touch-id';
import Toast from './Toast';
import i18n from './i18n/index';

TouchID
  .isSupported({unifiedErrors: true})
  .then(biometryType => {
    Config.TouchID = biometryType;
    if (biometryType == 'FaceID') {
      Config.TouchID = i18n.touchid_faceID;
    } else {
      Config.TouchID = i18n.touchid_touchID;
    }
  });;;

let walletPasswordRef;
export let rootTopViewRef;

export function setWalletPasswordRef(ref) {
  walletPasswordRef = ref;
}



export function setRootTopViewRef(ref) {
  rootTopViewRef = ref
}



export function rootTopViewRefShow(params) {
  rootTopViewRef.onShow(params);
}

export function rootTopViewRefHide(params) {
  rootTopViewRef.onHide(params);
}

export function logOut() {
  Config.userData = {
    ...Config.defaultUserData
  }
  AsyncStorage.removeItem('user')
  NavigationService.resetRoot('Login')
}

export function saveCard(cardNumber) {

  if (Config.userData.cardNumber != cardNumber) {
    Config.userData.cardNumber = cardNumber;
    updateUserData();
  }
}

export function saveRealNameSta(realNameSta) {
  if (Config.userData.realNameSta != realNameSta) {
    Config.userData.realNameSta = realNameSta;
    updateUserData()
  }
}

export function saveIpConfig(ipConfig) {
  if (ipConfig.selectedNet && Config.ipConfig.selectedNet != ipConfig.selectedNet) {
    ipConfig.useChainNet = '';
  }
  updateIp(ipConfig)
  AsyncStorage.setItem(Config.saveIPKey, JSON.stringify(Config.ipConfig))
}

export function updateIp(ipConfig) {
  Config.ipConfig = {
    ...Config.ipConfig,
    ...ipConfig
  }
  Config.PLEDGE_HOST = Config.ipConfig[Config.ipConfig.selectedNet].stake;
  Config.WEB_KEY = Config.ipConfig[Config.ipConfig.selectedNet].web
}

export function updateUserData(data = {}) {
  Config.userData = {
    ...Config.userData,
    ...data
  }
  if (Config.userData.nullPassword) {
    return;
  }
  AsyncStorage.setItem('user', JSON.stringify(Config.userData))
}

export function switchTouchId(callback) {
  if (Config.userData.useTouchID == true) {

    Alert.alert('', i18n.touchid_closeTitle, [
      {
        text: i18n.my_continue,
        onPress: () => {
          updateUserData({useTouchID: false});
          callback();
        }
      }, {
        text: i18n.my_cancel
      }
    ])

    return;
  }

  authenticateTouchId({
    successCallback: () => {
      updateUserData({useTouchID: true});
      callback();
    },
    errorCallback: () => {}
  })

}

export function authWalletPassword(callback) {

  if (!Config.userData.useTouchID) {
    authWalletPasswordInput(callback);
    return;
  }

  authenticateTouchId({
    successCallback: () => {
      console.warn(11111);
      callback();
    },
    errorCallback: error => {
      if (error.code == 'USER_CANCELED' || error.code == 'LOCKOUT' || error.code == 'NOT_SUPPORTED' || error.code == 'UNKNOWN_ERROR') {
        authWalletPasswordInput(callback);
      }
    }
  })
}

export function authWalletPasswordInput(callback) {
  walletPasswordRef.onShow(pwd => {

    if (!pwd) {
      return;
    }

    if (pwd == Config.walletPassword) {
      callback();
    } else {
      Toast(i18n.wallet_manager_pwdErr);
    }
  })
}



export function authenticateTouchId({successCallback, errorCallback}) {

  const optionalConfigObject = {
    title: '', // Android
    imageColor: Config.appColor, // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: i18n.touchid_title,
    sensorErrorDescription: 'Failed', // Android
    cancelText: i18n.my_cancel, // Android
    unifiedErrors: true, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  TouchID
    .authenticate(i18n.touchid_title, optionalConfigObject)
    .then(success => {
      console.warn('Authenticated Successfully');
      successCallback && successCallback();
    })
    .catch(error => {
      console.warn(error.code);
      errorCallback && errorCallback(error);
    });

}