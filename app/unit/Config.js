import {Dimensions, Platform, StatusBar, NativeModules} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import {KYC_STATUS_NONE} from './ConstValue';

console.warn('mac ===  ', DeviceInfo.getMACAddress());

export const defaultUserData = {
  lastLogin: 0,
  useTouchID: false,
}
export const userData = {
  ...defaultUserData
}

// 颜色
export const appColor = '#383276'
export const bgColor = '#F5F5F5'
export const lineColor = '#e5e5e5'
export const navColor = '#00b3fd'
export const disableColor = '#ccc'
export const borderColor = '#D5D5D5'

// 设备信息
const window = Dimensions.get('window')
export const width = window.width
export const height = window.height
export const isIos = Platform.OS == 'ios'
export const isAndroid = Platform.OS == 'android'
export const statusBarHeight = isIos
  ? parseFloat(NativeModules.iOSInfo.statusbarHeight)
  : StatusBar.currentHeight
export const navBarHeight = statusBarHeight + 44
export const videoHeight = width * 210 / 375
export const isEn = DeviceInfo
  .getDeviceLocale()
  .indexOf('en') > -1
export const isZh = DeviceInfo
  .getDeviceLocale()
  .indexOf('zh') > -1

// 通知
export const eventUpdateHomeData = 'eventUpdateHomeData'
export const saveIPKey = 'MegrezIPConfig'
export const isAppstore = false;
export const PLEDGE_HOST = "http://tianquanstake.zvchain.io:8088/"; //  tianquan
export const ORDER_PAY_ADDRESS = "zve2a05227531da8094eda4e671c118e5ce04d5028b85498bea76d02de386f72c2";

export const isDev = false;
export const WEB_KEY = "MainNet";
export const defaulIpConfig = {
  "yaoguang": {
    "stake": PLEDGE_HOST,
    "chains": ["http://47.104.189.61:8104/"],
    'web': 'TestNet'
  },
  "kaiyang": {
    "stake": PLEDGE_HOST,
    "chains": [
      "http://node1.zvchain.io:8101/", "http://node2.zvchain.io:8101/", "http://node3.zvchain.io:8101/", "http://node4.zvchain.io:8101/"
    ],
    'web': 'TestNet'
  },
  "admin": {
    "stake": PLEDGE_HOST,
    "chains": [
      "https://api.jokechain.cc:8101", "https://api.ghostminer.in:8101", "https://api.firepool.pro:8101"
    ],
    'web': 'MainNet'
  },
  selectedNet: 'admin',
  useChainNet: ''
}
export const ipConfig = {
  ...defaulIpConfig
}
export const walletPassword = ''
