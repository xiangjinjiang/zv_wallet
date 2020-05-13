import {BigNumber} from 'bignumber.js/bignumber';
import i18n from './i18n/index';
import * as Config from './Config';
import CoinConfig from './CoinConfig';
import CryptoJS from 'crypto-js';
const {JSEncrypt} = require('encryptlong')
// 公钥
const PUB_KEY = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTByPH6c1J/FnK' +
    '+JDEWNR0lS5XOJWTE1vYTlZIO3ao7cFYzowrTUQCLHMY4r2TqqJUECDeLVl6X4Ela0v5udcgKoviWSqd' +
    'nfLT1my77+SwyJMJIAdaMTRGBG/xw4i4zMhn8xKsg9tvwSB+wYPJ2vqpxdU5NxxJYFA7ccM6e7M/twID' +
    'AQAB\n-----END PUBLIC KEY-----\n';

/// 设置数字小数点位数，和增加千分号
export function toFix(amount, precision = 6, isMoney) {
  precision = parseInt(precision);
  let n = BigNumber(amount).toFixed(precision, 1)
  if (isNaN(n)) {
    return 0;
  }

  if (isMoney) {
    return formatNumber(n)
  }
  return n
}

//增加千分号
export function formatNumber(num) {
  if (isNaN(num)) {
    return 0;
  }

  let groups = (/([\-\+]?)(\d*)(\.\d+)?/g).exec("" + num),
    mask = groups[1], //符号位
    integers = (groups[2] || "").split(""), //整数部分
    decimal = groups[3] || "", //小数部分
    remain = integers.length % 3;

  let temp = integers.reduce(function (previousValue, currentValue, index) {
    if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
      return previousValue + currentValue + ",";
    } else {
      return previousValue + currentValue;
    }
  }, "").replace(/\,$/g, "");

  return mask + temp + decimal;
}

export const showCoin = coin => {
  let {balance, precision} = coin;
  return toFix(BigNumber(balance).div(1e8), precision, true)
}

export const showPercent = value => {
  let n = 2;
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

export const showZV = (value = 0, n = 4) => {
  n = parseInt(n)
  if (isNaN(value)) {
    return 0;
  }

  let result = BigNumber(value).toFixed(n, 1);

  if (result.indexOf('.')>-1) {
    result = result
      .replace(/0+?$/, '')
      .replace(/[.]$/, '');
  }

  if (!result) {
    result = '0'
  }
  return result
}

//时间戳转换显示
export const time2Text = (time, fmt = 'hh:mm MM/dd') => {
  if (time <= 0) {
    return ''
  }
  time = new Date(time)
  let o = {
    "M+": time.getMonth() + 1, //月份
    "d+": time.getDate(), //日
    "h+": time.getHours(), //小时
    "m+": time.getMinutes(), //分
    "s+": time.getSeconds(), //秒
    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
    "S": time.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) 
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o) 
    if (new RegExp("(" + k + ")").test(fmt)) 
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export const billShowDate = (time) => {
  const today = new Date(new Date().toLocaleDateString()).getTime()
  const day = 1000 * 60 * 60 * 24
  const diff = today - time;

  if (diff <= 0) {
    return i18n.bill_today
  } else if (diff < day) {
    return i18n.bill_yesterday
  } else {
    return time2Text(time, 'M-d')
  }
}

export function lastLoginText(time) {
  const now = new Date().getTime()
  const min = 1000 * 60
  const diff = now - time

  if (diff >= now / 2 || diff < min || time < min || !time) {
    return i18n.my_justNow
  } else if (diff < min * 60) {
    let showMin = parseInt(diff / min)
    if (showMin > 1 && Config.isEn) {
      return showMin + 'mins ago'
    }
    return showMin + i18n.my_min
  } else if (diff < min * 60 * 12) {
    let showHour = parseInt(diff / (min * 60));
    let showMin = parseInt(diff % (min * 60) / min);
    let my_hour = i18n.my_hour;
    let my_min = i18n.my_min;
    if (showHour > 1 && Config.isEn) 
      my_hour = 'hrs'
    if (showMin > 1 && Config.isEn) 
      my_min = 'mins ago'
    return `${showHour}${my_hour} ${showMin}${my_min}`
  } else {
    return time2Text(time, 'yyyy-MM-dd hh:mm')
  }
}

export function cardNumber(card = '') {
  if (!card || card.length < 4) {
    return ''
  }
  return card.substr(0, 4) + '******' + card.substr(card.length - 4, 4)
}

export function phone(phone = '') {
  if (!phone || phone.length < 4) {
    return ''
  }

  return phone.substr(0, 3) + '****' + phone.substr(phone.length - 4, 4)
}

export function dataFromQrcode(qrcode = '') {
  let qrData = {};
  if (!qrcode) {
    return qrData;
  }
  let index = qrcode.indexOf('?');
  if (qrcode.indexOf('http') == 0) {
    qrData.url = qrcode;
  } else {
    if (index < 0) {
      qrData.address = qrcode
    } else {
      qrData.address = qrcode.substr(0, index);
    }
  }
  if (index > 0) {
    const paramStrng = qrcode.substr(index + 1, qrcode.length - index - 1);
    const paramArray = paramStrng.split('&');
    paramArray.forEach(item => {
      let tmp = item.split('=');
      if (tmp.length >= 1) {
        qrData[tmp[0]] = tmp[1]
      }
    });
  }

  return qrData;
}

/**
 *
 * @param {*} str
 * @param {*} number
 * @returns {string}
 */
export function addressSting(str = '', number = 5) {
  if (!str) {
    return '';
  }
  if (str.length < number) {
    return str;
  }
  return str.substr(0, number) + '...' + str.substr(str.length - number, number)
}

export function __string2byte(str) {
  var bytes = new Array();
  var len,
    c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0);
      bytes.push(((c >> 12) & 0x3F) | 0x80);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0);
      bytes.push((c & 0x3F) | 0x80);
    } else {
      bytes.push(c & 0xFF);
    }
  }
  return bytes
}

export function __bytes2Str(arr) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i].toString(16);
    if (tmp.length == 1) {
      tmp = "0" + tmp;
    }
    str += tmp;
  }
  return '0x' + str;
}

export function stringToByteString(str) {
  const bytes = __string2byte(str)
  return __bytes2Str(bytes);
}
/**
 *
 * @param {Number} n
 */
export const toRa = (n) => {
  var arr = ['Ra', 'kRa', 'MRa', 'ZVC']
  var i;
  var len = arr.length - 1

  for (i = 0, n = +n || 0; i < len && n >= 1000; ++i, n /= 1000) {}
  n = n.toFixed(9);
  return (i === len
    ? numberAddComma(n)
    : n) + ' ' + arr[i]
}

export function numberAddComma(n) {
  n = +n || 0

  var parts = n
    .toString()
    .split('.')

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const failReasonList_zh = {
  "1": "执行失败",
  "2": "余额不足",
  "3": "合约方法不存在",
  "4": "合约执行失败",
  "5": "gas不足",
  "6": "合约不存在",
  "7": "解析参数异常",
  "8": "矿工被冻结",
  "9": "质押超过上限",
  "10": "当前质押余额不足,不能reduce",
  "11": "质押低于最小值,并且是激活状态，不能reduce",
  "12": "质押低于最小值,并且在工作组内，不能reduce",
  "13": "减质押未到指定块高",
  "14": "当前周期已经投过票了",
  "15": "不支持该操作",
  "16": "没有满质押",
  "17": "守护节点失效块高超过限值",
  "18": "改变守护节点模式过期",
  "19": "已经处于准备状态",
  "20": "退钱块高还未到",
  "21": "该矿工不存在"
}

const failReasonList_en = {
  "1": "Failure",
  "2": "Insufficient balance",
  "3": "Call contract method does not exist",
  "4": "Contract execution failed",
  "5": "Insufficient Gas",
  "6": "Contract does not exist",
  "7": "Parsing parameter exception",
  "8": "Miners are frozen",
  "9": "Staking exceeds the upper limit",
  "10": "Reduce amount exceeds staking",
  "11": "Staking amount must more than 500 when miner is active status",
  "12": "Staking amount must more than 500 when miner is in work group",
  "13": "Can not reduce before the specified block height",
  "14": "The current cycle has already voted",
  "15": "This operation is not supported",
  "16": "Not full staking",
  "17": "Applying the guardian node exceeds the invalid limit",
  "18": "Changing guardian mode expired",
  "19": "Ready now",
  "20": "Can not refund before the specified block height",
  "21": "Miners do not exist"
}

export function txErrorText(status = '') {
  let reason;
  if (Config.isZh) {
    reason = failReasonList_zh[status]
  } else {
    reason = failReasonList_en[status]
  }
  if (!reason) {
    reason = '';
  }
  return reason;
}

export function inputValue(value, decimal = 0, max = 1e10) {
  value = BigNumber(value).toString();
  if (BigNumber(value).gt(max)) 
    return '';
  if (isNaN(value)) 
    return '';
  return value;
}

export function rainMD5(address) {
  return CryptoJS.MD5('zv' + address + 'c');
}

export function i18nParams(text, ...param) {
  if (!text) {
    return '';
  }

  if (param) {
    for (let key in param) {
      text = text.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
    }
  }
  return text;
}
export function rsaString(string = '') {

  let encryptor = new JSEncrypt()

  encryptor.setPublicKey(PUB_KEY)

  let cptData = encryptor.encryptLong(string)

  return cptData

}