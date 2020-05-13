import Picker from 'react-native-picker';
import {i18n} from '../unit/AllUnit';
import {Keyboard} from 'react-native';

export const show = paras => {
  Keyboard.dismiss(); //收起键盘

  Picker.init({
    pickerTitleText: '',
    pickerConfirmBtnText: i18n.my_continue,
    pickerCancelBtnText: i18n.my_cancel,
    pickerToolBarBg: [
      255, 255, 255, 1
    ],
    pickerBg: [
      255, 255, 255, 1
    ],
    pickerConfirmBtnColor: [
      0, 137, 255, 1
    ],
    pickerCancelBtnColor: [
      0, 137, 255, 1
    ],
    ...paras
  });
  Picker.show();
}

export const hide = () => {
  Picker.hide()
}
