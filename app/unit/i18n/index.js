import DeviceInfo from 'react-native-device-info';
import en from './en';
import zh from './zh';
import ko from './ko';

const deviceLocale = DeviceInfo.getDeviceLocale();
let local = en;
if (deviceLocale.indexOf('ko') != -1) {
  // local = ko;
} else if (deviceLocale.indexOf('zh') != -1) {
  local = zh;
}

export default local