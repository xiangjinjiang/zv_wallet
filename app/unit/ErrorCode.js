import DeviceInfo from 'react-native-device-info';
import i18n from './i18n/index';


export default function getErrorMsg(code = '', param,message) {
  // const deviceLocale = DeviceInfo.getDeviceLocale();
  // const err = deviceLocale.indexOf('en') > -1
  //   ? errorCode_en
  //   : errorCode

  let msg = i18n[code]

  if (param) {
    for(let key in param){
      msg = msg.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
      }
  }
  msg = msg || message;
  msg = msg || `error code: ${code}`
  return msg
}
