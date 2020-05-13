import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Clipboard
} from 'react-native';
import { NavBar, EmptyComponent, Shadow, TopPadding } from '../../../widget/AllWidget'
import {
  Config,
  fullUrlRequest,
  i18n,
  Toast,
  ShowText,
  NavigationService
} from '../../../unit/AllUnit';
import WalletAction from '../../../redux/actions/WalletAction';
import HomeHeader from '../view/HomeHeader'

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      miningRight: 0,
      expiredHeight: 0,
      isNoData: false
    };
  }

  componentWillMount() {
    const { address } = WalletAction.selectedAccount();
    fullUrlRequest(Config.PLEDGE_HOST + '/assets/groupIncome', {
      memberAddress: address
    }, 'GET').then(data => {
      let isNoData = false;
      if (typeof data.length == 'undefined' || data.length == 0) {
        isNoData = true;
        data = [];
      }
      this.setState({ data, isNoData })
    })

    fullUrlRequest(Config.PLEDGE_HOST + '/assets/miningRight', {
      address
    }, 'GET').then(data => {
      this.setState(data)
    })
  }

  renderView = (title, rising, left, right) => {

    return <Shadow
      top={100}
      left={100}
      source={require('../../../img/discover/bg_wakuangjiankong_all.png')}
      style={{
        width: Config.width - 14,
        height: 91 + left.length * 23,
        padding: 10,
        marginTop: 5
      }}
      key={title}>

      <View style={styles.titleV}>
        <Text style={styles.title}>{i18n.creation_name}</Text>
        <Text style={styles.groupName}>{title}</Text>
        {rising == -1 && <Image source={require('../../../img/discover/icon_down.png')} />}
        {rising == 1 && <Image source={require('../../../img/discover/icon_up.png')} />}
      </View>

      <View style={styles.view}>
        <View style={styles.leftView}>
          {left.map((item, key) => {
            return <Text key={key} style={styles.leftText}>{item}</Text>
          })}
        </View>
        <View style={styles.rightView}>
          {right.map((item, key) => {
            if (key == 2) {
              return <TouchableOpacity
                style={styles.copyV}
                onPress={() => {
                  Clipboard.setString(item);
                  Toast(i18n.reload_copySuccess)
                }}>
                <Text key={key} style={styles.rightText}>{ShowText.addressSting(item, 8)}</Text>
                <Image source={require('../../../img/wallet/icon_copy.png')} />
              </TouchableOpacity>
            }
            return <Text key={key} style={styles.rightText}>{item}</Text>
          })}
        </View>
      </View>
    </Shadow>
  }

  render() {
    const { data, miningRight, expiredHeight, isNoData } = this.state;

    return (
      <View style={styles.container}>
        <NavBar title={i18n.creation_title} />
        <View style={styles.infoV}>
          <Image
            style={styles.infoImg}
            source={require('../../../img/discover/icon_tongzhi.png')} />
          <Text style={styles.infoT}>{i18n.creation_info}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollV}
          showsVerticalScrollIndicator={false}>

          <Shadow
            top={80}
            left={100}
            source={require('../../../img/discover/bg_wakuangjiankong_all.png')}
            style={{
              width: Config.width - 14,
              height: 180,
              padding: 10
            }}>
            <View style={styles.titleV}>
              <Text style={styles.title}>{i18n.creation_miner}</Text>
            </View>

            <View style={styles.view}>
              <View style={styles.leftView}>
                <Text style={styles.leftText}>{i18n.creation_rights}</Text>
                <Text style={styles.leftText}>{i18n.creation_blockHeight}</Text>

              </View>
              <View style={styles.rightView}>
                <Text style={styles.activedText}>{miningRight + ' ZVC'}</Text>
                <Text style={styles.rightText}>{expiredHeight}</Text>
              </View>
            </View>

            <Text style={styles.endBlock}>{i18n.creation_endBlock}</Text>

          </Shadow>

          <TouchableOpacity onPress={() => NavigationService.switchToOffChain('Money')}>
            <ImageBackground
              source={require('../../../img/discover/img_wenjiantouzi.png')}
              style={styles.bannerImg}>
              <Text style={styles.adText}>{i18n.creation_adText}</Text>
              <View style={styles.row}>
                <View style={styles.adGoV}>
                  <Text style={styles.adGoText}>{i18n.creation_adGo}</Text>
                </View>
              </View>

            </ImageBackground>

          </TouchableOpacity>

          <TopPadding></TopPadding>
          <HomeHeader title={i18n.creation_activity}></HomeHeader>

          {data.map((item, index) => {
            const {
              groupName,
              groupBalanceToday,
              rising,
              memberIncomeToday,
              totalIncome,
              rateOfReturn,
              hash
            } = item;

            return this.renderView(groupName, rising, [
              i18n.creation_allEarnings, i18n.creation_earnings, i18n.creation_hash, i18n.creation_totalEarnings, i18n.creation_togetherEarnings
            ], [
              ShowText.showZV(groupBalanceToday) + ' ZVC',
              ShowText.showZV(memberIncomeToday) + ' ZVC',
              hash,
              ShowText.showZV(totalIncome) + ' ZVC',
              rateOfReturn + '%'
            ])
          })}
          <EmptyComponent
            img='no_group'
            hide={!isNoData}
            text={i18n.creation_noGroup}
            justifyContent='flex-start' />

        </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  infoV: {
    width: Config.width,
    paddingHorizontal: 7,
    paddingVertical: 9,
    backgroundColor: '#272252',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  infoImg: {
    marginRight: 9
  },
  infoT: {
    fontSize: 13,
    color: '#fff'
  },
  scrollV: {
    alignItems: 'center'
  },
  titleV: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    marginTop: 8
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  groupName: {
    fontSize: 14,
    color: Config.appColor,
    fontWeight: '500',
    marginLeft: 15,
    flex: 1
  },
  view: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 15
  },
  leftView: {
    alignItems: 'flex-end'
  },
  rightView: {
    flex: 1
  },
  leftText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 23,
    marginRight: 15
  },
  rightText: {
    fontSize: 12,
    color: '#999',
    lineHeight: 23
  },
  activedText: {
    fontSize: 12,
    color: Config.appColor,
    fontWeight: '500',
    lineHeight: 23
  },
  copyV: {
    height: 23,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  endBlock: {
    fontSize: 13,
    color: '#999',
    paddingHorizontal: 15
  },

  bannerImg: {
    height: 73,
    width: Config.width - 30,
    resizeMode: 'stretch',
    margin: 15
  },
  adText: {
    margin: 15,
    marginBottom: 10,
    fontSize: 15,
    color: '#fff',
    fontWeight: '500'
  },
  adGoV: {
    marginLeft: 15,
    flexDirection: 'row',
    paddingHorizontal: 11,
    paddingVertical: 3.5,
    borderRadius: 9,
    backgroundColor: '#F1C073'
  },
  adGoText: {
    fontSize: 11,
    color: '#fff'
  },
  row: {
    flexDirection: 'row'
  }
});