import RootToast from 'react-native-root-toast';
import * as Config from './Config';

const ToastDefault = {
  position: RootToast.positions.CENTER,
  hideOnPress: false,
  shadow: false,
  duration: 2500,
  opacity: 1,
  backgroundColor: '#666'
  // backgroundColor: 'rgba(0,0,0,0.5)'
}
const Toast = (text, option) => {
  option = {
    ...ToastDefault,
    ...option
  }
  RootToast.show(text, option)
}

export default Toast