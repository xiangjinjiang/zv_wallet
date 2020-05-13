import Toast from './Toast';
import {Clipboard} from 'react-native';
import i18n from './i18n/index';
import * as Config from './Config';
import BackgroundJob from 'react-native-background-job';

let _timer;
const clearTime = 1000 * 60;
let _copyString;

if (Config.isAndroid) {
  const job = {
    jobKey: "clear",
    job: () => {
      _clear();
    }
  };
  BackgroundJob.register(job);
}

export async function copyString(copyString, needClear) {
  Toast(i18n.reload_copySuccess);
  Clipboard.setString(copyString);

  if (needClear) {
    if (Config.isIos) {
      _timer && clearTimeout(_timer);
      _timer = setTimeout(() => {
        _clear(copyString)
      }, clearTime);
    } else {
      _copyString = copyString;
      const backgroundSchedule = {
        jobKey: "clear",
        period: clearTime,
        allowExecutionInForeground: true
      }

      BackgroundJob.schedule(backgroundSchedule);
    }

  }

}

async function _clear(copyString) {
  BackgroundJob.cancelAll();

  if (!copyString) {
    copyString = _copyString;
  }
  const content = await Clipboard.getString();
  if (content && content == copyString) {
    Clipboard.setString('');
  }
}
