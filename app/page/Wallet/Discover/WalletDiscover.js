import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { NavBar, TopPadding, Button, CommonCell } from '../../../widget/AllWidget'
import {
  Config,
  fullUrlRequest,
  i18n,
  NavigationService,
  UMAnalyticsModule,
  ShowText
} from '../../../unit/AllUnit';
import { connect } from 'react-redux';
import WalletAction from '../../../redux/actions/WalletAction';
import MinerInfoAction from '../../../redux/actions/MinerInfoAction';
import HomeBtn from '../view/HomeBtn';
import Carousel from 'react-native-snap-carousel';
import { bindActionCreators } from 'redux'
import HomeHeader from '../view/HomeHeader';
import { NavigationEvents } from "react-navigation";

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this
      .props
      .updateBlockHeightAction();
  }


  onPress = item => {

    if (item.pushTo == 'MyPledge') {
      const { address } = WalletAction.selectedAccount();

      fullUrlRequest(Config.PLEDGE_HOST + '/pledge/apply/confirm/' + address, {}, 'GET').then(data => {
        console.warn(data);
        let state = -1;
        if (data) {
          state = data.state;
        }
        const routeName = ['MyPledge', 'PledgePadding', 'PledgeSuccess', 'PledgeFail'][(state + 1) % 4];
        console.warn(routeName);

        NavigationService.navigate(routeName, data)
      })
      return;
    }

    NavigationService.navigate(item.pushTo)
  }

  renderItem = ({ item, k }) => {
    return <TouchableOpacity
      onPress={() => {
        if (item.onPress) {
          item.onPress();
          return;
        }
        if (item.url) {
          NavigationService.navigate('MsgWebView', { url: item.url })
        }
      }}>
      <Image source={item.source} key={k} style={styles.banner} />
    </TouchableOpacity>
  }

  render() {

    const goMoneyImg = Config.isZh
      ? require('../../../img/discover/img_found_banner_3.png')
      : require('../../../img/discover/img_found_banner_en_3.png')

    const banners = [
      {
        source: goMoneyImg,
        onPress: () => NavigationService.switchToOffChain('Money')
      }
    ];

    const buttons = [
      {
        img: require('../../../img/discover/icon_chuangshijihua.png'),
        title: i18n.creation_title,
        onPress: () => {
          UMAnalyticsModule.onEvent('creation_btn')
          NavigationService.navigate('CreationPlan')
        }
      }, {
        img: require('../../../img/discover/icon_wakuangjiankong.png'),
        title: i18n.discover_miner,
        onPress: () => {
          UMAnalyticsModule.onEvent('miner_btn')
          NavigationService.navigate('Miner')
        }
      }
    ];

    let dappList = [
      {
        img: require('../../../img/discover/icon_createIntegral.png'),
        title: i18n.zrc_create,
        onPress: () => {
          UMAnalyticsModule.onEvent('miner_btn')
          NavigationService.navigate('CreateZrc')
        }
      }
    ];

    return (
      <View style={styles.container}>
        <NavBar title={i18n.tab_discover} />
        <NavigationEvents onDidFocus={this.onDidFocus}></NavigationEvents>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TopPadding></TopPadding>

          <View style={styles.wrapper}>
            <Carousel
              ref={(c) => {
                this._carousel = c;
              }}
              useScrollView={true}
              loop={true}
              autoplay={true}
              data={banners}
              renderItem={this.renderItem}
              sliderWidth={Config.width}
              itemWidth={Config.width - 30} />
          </View>

          <TopPadding></TopPadding>

          <HomeHeader title={i18n.discover_service} />

          <View style={styles.buttonV}>

            {buttons.map(item => {
              return <View style={styles.button} key={item.title}>
                <HomeBtn {...item} />
              </View>
            })}
          </View>
          <TopPadding></TopPadding>
          <HomeHeader title='DAPP' />

          <View style={styles.buttonV}>
            {dappList.map(item => {
              return <View style={styles.button} key={item.title}>
                <HomeBtn {...item} />
              </View>
            })}
          </View>
        </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  title: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '500'
  },

  buttonV: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingHorizontal: 25
  },
  button: {
    width: (Config.width - 50) / 3,
    height: 60,
    marginBottom: 30
  },

  wrapper: {
    paddingVertical: 10
  },
  banner: {
    width: Config.width - 30,
    height: (Config.width - 30) * 160 / 345,
    borderRadius: 4,
    overflow: 'hidden'
  }

});


export default connect(state => ({ wallet: state.wallet }), dispatch => ({
  updateBlockHeightAction: bindActionCreators(MinerInfoAction.updateBlockHeightAction, dispatch)
}))(Page)
