import Toast from './Toast';
import * as Config from './Config';
import { AsyncStorage } from 'react-native';
import ErrorCode from './ErrorCode';
import * as UserData from './UserData';
import i18n from './i18n/index';
const JSONbig = require('json-bigint');

const _initChainUrl = (ipList) => {
  if (ipList.length == 1) {
    UserData.saveIpConfig({ useChainNet: ipList[0] })
    return;
  }

  ipList.map(url => {
    chainRequest({
      "method": "Gzv_blockHeight",
      "params": []
    }, url, false).then(data => {
      if (!Config.ipConfig.useChainNet) {
        UserData.saveIpConfig({ useChainNet: url })
      }
    })
  });
}

const chainRequest = (data = {}, url, showError) => {
  if (!url) {
    url = Config.ipConfig.useChainNet;
  }
  if (!url) {
    const selectedConfig = Config.ipConfig[Config.ipConfig.selectedNet];
    if (!selectedConfig || !selectedConfig.chains || !selectedConfig.chains.length) {
      Toast('Chain Url Config Error!');
      UserData.saveIpConfig(Config.defaulIpConfig);
      return;
    } else {
      url = selectedConfig.chains[0];
      _initChainUrl(selectedConfig.chains);
    }
  }

  data.jsonrpc = "2.0";
  data.id = "1";
  return fullUrlRequest(url, data, 'POST', showError)
}

const fullUrlRequest = (url, data, method = 'POST', showError) => {

  const fetchOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (method == 'POST') {
    fetchOptions.body = JSON.stringify(data)
  }
  if (method == 'GET' && Object.getOwnPropertyNames(data).length > 0) {
    url = url + '?';
    for (var o in data) {
      url += o + "=" + data[o] + "&";
    }
  }

  return fetchUnit(url, fetchOptions, showError)
}

const fetchUnit = (url, fetchOptions = {}, showError = true) => {

  return new Promise(function (resolve, reject) {

    let gotData = false;
    let timer;
    if (showError) {
      timer = setTimeout(() => {
        if (gotData == false) {
          Toast(i18n.network_err)
          console.warn('----error----', url);
          reject(-1);
        }
      }, 20000);
    }

    fetch(url, fetchOptions)
      .then(response => response.text())
      .then(response => JSONbig.parse(response))
      .then(json => {

        gotData = true;
        clearTimeout(timer)

        if (json.acknowledges) {
          const {
            couponShowVos = [],
            redPacketInners = [],
            paradropVO = []
          } = json.acknowledges;
          const list = redPacketInners
            .concat(couponShowVos)
            .concat(paradropVO);
          if (list.length) {
          }
        }

        if (json.id == 1) {
          resolve(json)
        } else if (json.status > 200) {
          return (json)
        } else if (json.code == 0 && json.success == true) {
          resolve(json.data)
        } else if (json.message = 'success' && json.code == 0) { //扫码
          resolve(json.data)
        } else if (json.code > 0) {
          return json
        } else {
          return json

          resolve(json)
        }

      })
      .then(json => {
        const code = json.code || json.status;
        Toast(ErrorCode(code, json.params, json.msg));
        reject(json);
      })
      .catch((err) => {
        gotData = true;

        if (showError && err.line || err.code) {
          if (err.line && err.line == 25779) {
            Toast(i18n.toast_serverError);
            reject(err);
          }
          return
        }

        reject(err);
      })
  })

};

export { chainRequest, fullUrlRequest }