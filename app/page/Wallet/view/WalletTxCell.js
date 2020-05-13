import React, {Component} from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {Config, ShowText, NavigationService, i18n} from '../../../unit/AllUnit';
import {Shadow} from '../../../widget/AllWidget';
import {BigNumber} from 'bignumber.js/bignumber';

export default function Cell(props) {
  let ads = props.userAdderss;
  const {
    decimal,
    coinName = 'ZVC'
  } = props;

  let item = props.item;
  let valueSymbol = '';
  let showAddress = ShowText.addressSting(item.hash);
  let imgSource;

  let value = ShowText.showZV(item.value)
  if (item.type == 0) {
    if (item.target == ads) { // 转入
      valueSymbol = '+'
      showAddress = ShowText.addressSting(item.source);
      imgSource = require('../../../img/wallet/icon_zhuanru.png');
    } else if (item.source == ads) {
      showAddress = ShowText.addressSting(item.target)
      valueSymbol = '-'
      imgSource = require('../../../img/wallet/icon_zhuanchu.png');
    }
  } else if (item.type == 1) { //合约部署
    imgSource = require('../../../img/wallet/icon_bushu.png');
    showAddress = ShowText.addressSting(item.hash);
  } else if (item.type == 2) { //合约调用
    imgSource = require('../../../img/wallet/icon_diaoyong.png');
    showAddress = ShowText.addressSting(item.hash);

  } else if (item.type == 3) { //质押
    imgSource = require('../../../img/wallet/icon_zhiyaojiechu.png');
    valueSymbol = props.symbol;
    valueSymbol = '-'
  } else if (item.type == 5) { //减少质押
    imgSource = require('../../../img/wallet/tx_type5.png');
    valueSymbol = props.symbol;
    valueSymbol = '+'
  } else if (item.type == 6) { //质押赎回
    imgSource = require('../../../img/wallet/tx_type6.png');
    valueSymbol = props.symbol;
    valueSymbol = '+'
  } else if (decimal != undefined) {

    if (item.target == ads) { // 转入
      valueSymbol = '+'
      showAddress = ShowText.addressSting(item.source);
      imgSource = require('../../../img/wallet/icon_zhuanru.png');
    } else if (item.source == ads) {
      showAddress = ShowText.addressSting(item.target)
      valueSymbol = '-'
      imgSource = require('../../../img/wallet/icon_zhuanchu.png');
    }
    value = BigNumber(item.value).div(Math.pow(10, decimal))
  }

  let shadowHeight = 80;
  let {localStatus} = item;

  if (item.isChecked == 0) {
    localStatus = 2;
  }
  if (item.status > 0) {
    localStatus = 0;
  }
  if (localStatus) {
    shadowHeight = 131;
  }
  let lineHeight = shadowHeight - 19;
  let statusList = [i18n.tx_status0, i18n.tx_status1, i18n.tx_status2];
  let time = '';
  if (item.curTime) {
    time = ShowText.time2Text(item.curTime)
  } else if (item.createdAt) {
    time = ShowText.time2Text(item.createdAt * 1000)
  }

  const failText = ShowText.txErrorText(item.status);

  const userNameStyle = {
    fontSize: 16,
    fontWeight: "500",
    color: '#333',
    width: 120
  };
  const userNumberStyle = {
    fontSize: 15,
    fontWeight: "500",
    color: '#383276',
    marginBottom: 8
  };
  if (Config.isAndroid) {
    userNameStyle.fontFamily = 'Robot';
    userNumberStyle.fontFamily = 'Robot';
  }

  // console.warn(item.value, decimal, value);

  return (
    <TouchableOpacity
      onPress={() => {
      if (item.hash) {
        NavigationService.navigate('TransactionDetails', {hash: item.hash});
      } else if (decimal != undefined) {
        NavigationService.navigate('ZrcTxDetail', {
          id: item.id,
          decimal,
          coinName
        });
      }
    }}>
      <Shadow style={styles.bg}>
        <View
          style={[
          styles.cell, {
            height: shadowHeight
          }
        ]}>
          <View
            style={[
            styles.line, {
              height: lineHeight
            }
          ]}></View>
          <View style={styles.flex1}>
            <View style={styles.rowCenter}>

              <Image style={styles.imgBox} source={imgSource}></Image>
              <View style={styles.flex1}>
                <Text style={userNameStyle}>{showAddress}</Text>
                <Text style={styles.userDate}>{time}</Text>
              </View>
              <View style={styles.rightV}>
                <Text style={userNumberStyle} numberOfLines={1}>{valueSymbol}{value + " " + coinName}</Text>
                {failText.length == 0 && <Image
                  style={styles.img}
                  source={valueSymbol == '+'
                  ? require('../../../img/wallet/img_receiveAllPage.png')
                  : require('../../../img/wallet/img_sendAllPage.png')}></Image>}

                {failText.length > 0 && <Text style={styles.failText}>{failText}</Text>}

              </View>
            </View>
            {localStatus > 0 && <View style={styles.row}>
              {statusList.map((item, index) => {
                if (index < localStatus) {
                  return <Image
                    source={require('../../../img/wallet/icon_chanpinzhouqi_choose.png')}
                    key={index}></Image>
                } else {
                  return <View style={styles.unchose} key={index}></View>
                }
              })}
            </View>
}

            {localStatus > 0 && <View style={styles.rowText}>
              {statusList.map((item, index) => {
                let textStyle = index < localStatus
                  ? styles.choseText
                  : styles.unchoseText;
                return <Text style={textStyle} key={index}>{item}</Text>
              })}
            </View>
}

          </View>

        </View>

      </Shadow>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  bg: {
    width: Config.width - 16,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -5
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Config.width - 30,
    flex: 1
  },
  line: {
    width: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(56, 50, 118, 0.5)'
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  imgBox: {
    marginRight: 8,
    marginLeft: 11
  },
  flex1: {
    flex: 1,
    justifyContent: 'center'
  },
  rowBetween: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  img: {
    alignSelf: 'flex-end'
  },
  rightV: {
    alignItems: 'flex-end',
    flex: 1
  },

  userDate: {
    marginTop: 8,
    fontWeight: '400',
    color: '#999',
    fontSize: 13
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 28,
    marginTop: 8,
    height: 3,
    backgroundColor: '#F5F5F5'
  },
  unchose: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CDCDCD',
    margin: -2
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15
  },
  choseText: {
    fontSize: 15,
    color: Config.appColor
  },
  unchoseText: {
    fontSize: 15,
    color: '#999'
  },
  failText: {
    fontSize: 15,
    color: '#666'
  }
});