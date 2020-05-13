/**
 * Created by yantongliang on 2017/7/26.
 */

import Toast from './Toast'

function isPhone(text = '', msg) {
  return /^1\d{10}$/.test(text) || Toast(msg || '请输入正确的手机号')
}

function isPassword(text = '', msg) {
  return /^\d{6}$/.test(text) || Toast(msg || '请输入6位数字密码')
}

function isEmail(text = '', msg) {
  return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(text) || Toast('请输入正确的邮箱')
}

function isCode(text = '', msg) {
  return /^\d{6}$/.test(text) || Toast('请输入正确的验证码')
}

function isPhoneOrEmail(text = '', msg) {
  const isPhone = /^1\d{10}$/.test(text)
  const isEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(text)
  return (isPhone || isEmail) || Toast('请输入正确的邮箱或手机号')
}

function isAllNumber(text = '', msg) {
  if (text.length < 1) {
    return Toast(msg || '请输入正确的手机号')
  }
  return /^[0-9]*$/.test(text) || Toast(msg || '请输入正确的手机号')
}
function isAuthCode(text = '', msg) {
  if (text.length < 1) {
    return Toast(msg || '请输入正确的验证码')
  }
  return /^[0-9]*$/.test(text) || Toast(msg || '请输入正确的验证码')
}
function isSafeCode(text = '', msg) {
  return /^\d{3}$/.test(text) || Toast(msg || '请输入正确的安全码')
}

function isAddress(text = '') {
  if (text.length < 60) {
    return false
  }
  return /^[Zz][Vv][0-9a-fA-F]{64}$/.test(text);
}

export default {
  isPhone,
  isPassword,
  isEmail,
  isPhoneOrEmail,
  isCode,
  isAllNumber,
  isSafeCode,
  isAuthCode,
  isAddress
}

/*给字符串添加方法,验证是否符合校验
* msg : 验证错误提示框显示的信息 可以为空
* */

/*
//是否是手机号
String.prototype.isPhone = function (msg) {
  return /^1\d{10}$/.test(this) || Toast.fail(msg || '请输入正确的手机号', 1, null, false)
};

//是否符合规则的密码
String.prototype.isAuthPassword = function (msg) {
  if (this.length < 8 || this.length > 20) {
    return Toast.fail(msg || '请输入8-20位包含数字和字母的密码', 1, null, false);
  }
  var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
  return (/\S/.test(this) || Toast.fail(msg || '请输入8-20位包含数字和字母的密码', 1, null, false))
};

String.prototype.isCode = function (msg) {
  return /^\d{6}$/.test(this) || Toast.fail(msg || '请输入正确的验证码', 1, null, false)
};

//是否为空
String.prototype.isEmpty = function (msg) {
  return (/\S/.test(this) || Toast.fail(msg || '不能为空', 1, null, false))
};

//是否是邮箱
String.prototype.isEmail = function () {
  return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this) || Toast.fail('请输入正确的邮箱', 1, null, false)
};

//是否是整数
String.prototype.isInt = function (msg) {
  return /^[-+]?\d*$/.test(this) || Toast.fail(msg || '请输入整数', 1, null, false)
};

//是否是大于0的正整数
String.prototype.isGreater0 = function (msg) {
  return /^[1-9]\d*$/.test(this) || Toast.fail(msg || '请输入大于0的整数', 1, null, false)
};


Date.prototype.Format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

*/
