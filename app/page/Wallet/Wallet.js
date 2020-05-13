import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ImageBackground,
  Clipboard,
  FlatList
} from 'react-native';
import {
  NavBar,
  TopPadding,
  ScrollTab,
  EmptyComponent,
  Shadow,
  BoldText
} from '../../widget/AllWidget'
import {
  Config,
  ConstValue,
  i18n,
  fullUrlRequest,
  ShowText,
  NavigationService,
  Toast,
  ValueVerify,
  TxManager,
  UMAnalyticsModule,
  chainRequest,
  UserData
} from '../../unit/AllUnit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import WalletAction from '../../redux/actions/WalletAction';
import MinerInfoAction from '../../redux/actions/MinerInfoAction';
import WalletTxCell from './view/WalletTxCell'
import { NavigationEvents } from 'react-navigation';
import HomeBtn from './view/HomeBtn'
import CheckView from './view/CheckView';
import QRSign from '../../unit/QRSign';

const { TX_TYPE_STAKEREFUND } = ConstValue;
const interval_time = 1000 * 30;
let _last_request = 0

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHiddenAllpages: true, //  可用余额卡片开关
      balanceData: {},
      IsHiddenBalance: false,
      refreshing: true,
      data: [
        [], [], []
      ],
      showCheckView: false,
      asset_otherAddrRefund: 0, // 质押在其他地址的待回退金额
      asset_lendStake: 0, // 借出的金额
      asset_exchange: 0, // usdt/zvc 汇率

    };
    this.tabIndex = 0;
    this.pageList = [1, 1, 1];
    this.pageSize = 10;

    this.loadMoreList = [false, false, false];
    this.lastAddress = ''
  }

  onGetQrcode = qrcode => {
    const data = ShowText.dataFromQrcode(qrcode);
    setTimeout(() => {
      if (data.url && data.zvc_tx == 1) {
        this
          .props
          .updateNonce();
        QRSign(data.url)
      } else if (ValueVerify.isAddress(data.address)) {
        NavigationService.navigate('WalletTransfer', { data })
      } else {
        Toast(i18n.wallet_qrcodeErr)
      }
    }, 300);
  }
  onQrcodePress = () => {
    NavigationService.toQrcode(this.onGetQrcode);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.isFocused && (new Date).getTime() - _last_request > interval_time) {
        this.getBalance()
      }
    }, interval_time);
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onDidFocus = () => {
    this.setState({
      data: [
        [], [], []
      ]
    })
    this.onRefresh(this.tabIndex);
    this.isFocused = true;
  }

  onDidBlur = () => this.isFocused = false;

  haderlClickAllpages = () => {
    this.setState({
      isHiddenAllpages: !this.state.isHiddenAllpages
    })
  }

  handleIsHidden = () => this.setState({
    IsHiddenBalance: !this.state.IsHiddenBalance
  })
  onCheckViewPress = () => this.setState({
    showCheckView: !this.state.showCheckView
  })

  onFlatListScroll = () => {
    if (!this.state.isHiddenAllpages) {
      this.setState({ isHiddenAllpages: true })
    }
  }

  onRefresh = tabIndex => {
    this.pageList[tabIndex] = 1;
    this.setState({ refreshing: true })
    this.getData(tabIndex)
  }
  onEndReached = tabIndex => {
    if (!this.loadMoreList[tabIndex])
      return
    this.pageList[tabIndex] += 1
    this.getData(tabIndex)
  }

  getRefundList = targets => {
    const { address } = WalletAction.selectedAccount();
    let asset_otherAddrRefund = 0;

    targets.map((target, index) => {
      chainRequest({
        "method": "Gzv_minerInfo",
        "params": [target, address]
      }).then(data => {
        if (!data.result) {
          return;
        }
        const { details, overview } = data.result;

        for (const item in details) {

          if (details.hasOwnProperty(item)) {
            const element = details[item];
            if (item == address) {
              element.forEach(stake => {
                if (stake.stake_status == 'frozen') {
                  asset_otherAddrRefund += stake.value
                }
              });
            }

          }
        }

        this.setState({ asset_otherAddrRefund })
      });
    })
  }

  getBalance = () => {
    this
      .props
      .updateSelectedBalance();
    this
      .props
      .updateMinerInfoAction();

    const { address } = WalletAction.selectedAccount();

    fullUrlRequest(Config.PLEDGE_HOST + '/assets/getAssetsAll', {
      address
    }, 'GET').then(data => {
      if (data) {
        const { exchange, lendStake, targets } = data;
        this.getRefundList(targets)
        this.setState({ asset_exchange: exchange, asset_lendStake: lendStake, asset_otherAddrRefund: 0 })
      }
    })
  }

  getData = (tabIndex) => {
    _last_request = (new Date).getTime();
    let pageNum = this.pageList[tabIndex];
    if (pageNum <= 1) {
      this.getBalance();
    }

    const { address } = WalletAction.selectedAccount();
    const type = parseInt(tabIndex) + 1;

    fullUrlRequest(Config.PLEDGE_HOST + '/queryTransactionList', {
      address: address,
      p: pageNum,
      type,
      pageSize: this.pageSize
    }, 'GET').then(data => {
      let trans = data;
      if (!trans.length) {
        trans = [];
      }
      let stateData = this.state.data;
      this.loadMoreList[tabIndex] = trans.length >= this.pageSize

      if (pageNum > 1) {
        stateData[tabIndex] = stateData[tabIndex].concat(trans)
      } else {
        const paddingTxList = TxManager.getPaddingTxList(trans, type, address, () => {
          this.onRefresh(tabIndex)
        });
        if (paddingTxList.length) {
          trans = paddingTxList.concat(trans)
        }
        stateData[tabIndex] = trans;
      }

      this.setState({ refreshing: false, data: stateData })
      return;
    }).catch(err => {
      console.log(err);

      this.setState({ refreshing: false })
    })
  }

  onUserRefund = () => {
    this.onCheckViewPress();
    NavigationService.navigate('Refund')
  }

  onLoanPress = () => {
    NavigationService.navigate('StakeList', { type: 5 })
  }
  onStakePress = () => {
    NavigationService.navigate('StakeList', { type: 4 })
  }
  onRefundPress = () => {
    const { refundAll } = this.props.minerInfo;
    let asset_refund = this.state.asset_otherAddrRefund + refundAll;
    asset_refund = ShowText.showZV(asset_refund)
    this.checkProps = {
      title: i18n.wallet_refundBalance,
      info: `${i18n.wallet_refundBalanceInfo} ${asset_refund} ZVC`
    }
    this.onCheckViewPress();
  }
  onBalancePress = () => {
    const { value } = WalletAction.selectedAccount();

    this.checkProps = {
      title: i18n.wallet_canUseBalance,
      info: `${i18n.wallet_canUseBalanceInfo} ${value} ZVC`,
      autoHide: true
    }
    this.onCheckViewPress();
  }

  allListComponent() {
    const titles = [i18n.send_All, i18n.friend_in, i18n.friend_out];
    let { address } = WalletAction.selectedAccount();
    return (
      <ScrollTab
        titles={titles}
        onTabChanged={index => {
          this.tabIndex = index;
          if (!this.state.data[index].length) {
            this.onRefresh(index)
          }
        }}>
        {titles.map((_itemTitle, tabIndex) => {
          return <FlatList
            onMoveShouldSetResponder={this.onFlatListScroll}
            key={tabIndex}
            refreshing={this.state.refreshing}
            showsVerticalScrollIndicator={false}
            style={styles.FlatListBox}
            onRefresh={() => this.onRefresh(tabIndex)}
            onEndReached={() => this.onEndReached(tabIndex)}
            keyExtractor={(item, k) => k + 'wallet1'}
            data={this.state.data[tabIndex]}
            renderItem={({ item, index }) => <WalletTxCell item={item} userAdderss={address} />}
            ListFooterComponent={< EmptyComponent img='no_list' hide={
              this.state.data[tabIndex].length > 0 || this.state.refreshing
            } />} />
        })}
      </ScrollTab>
    )
  }

  renderBalance = (title, balance, img, onPress) => {
    if (this.state.IsHiddenBalance) {
      balance = '*****'
    } else {
      balance = ShowText.showZV(balance)
    }

    return <TouchableOpacity onPress={onPress}>
      <ImageBackground source={img} style={styles.balanceBg}>
        <Text style={styles.balanceTitle}>{title}</Text>
        <Text style={styles.balanceText}>{balance}</Text>
      </ImageBackground>
    </TouchableOpacity>
  }

  render() {

    const coin_btns = [
      {
        img: require('../../img/wallet/icon_chongbi.png'),
        title: i18n.wallet_receipt,
        backgroundColor: '#4DB4FF',
        onPress: () => {
          UMAnalyticsModule.onEvent('wallet_btn_receive');
          NavigationService.navigate('WalletReceive')
        }
      }, {
        img: require('../../img/wallet/icon_zhuanbi.png'),
        title: i18n.wallet_tx_type0,
        backgroundColor: '#FF814D',
        onPress: () => {
          UMAnalyticsModule.onEvent('wallet_btn_tx');
          NavigationService.navigate('WalletTransfer')
        }
      }, {
        img: require('../../img/wallet/icon_shaoma.png'),
        title: i18n.send_qrTitle,
        backgroundColor: '#7D4DFF',
        onPress: () => {
          UMAnalyticsModule.onEvent('wallet_btn_qr');
          this.onQrcodePress();
        }
      }
    ];

    //计算资产
    const { name, value, address } = WalletAction.selectedAccount();
    const { asset_exchange, asset_lendStake, asset_otherAddrRefund } = this.state;
    const { stakeAll, refundAll, selfStakeP, selfStakeV } = this.props.minerInfo;

    let asset_refund = asset_otherAddrRefund + refundAll; //所有的质押借出
    // 余额 + 在其他地址质押待退回的金额 + 质押借出的金额 + 自己质押的金额 + 自己质押待退回的金额
    let allZVC = value + asset_refund + selfStakeP + selfStakeV + asset_lendStake ;
    let usdtBalance = ShowText.showZV(allZVC * asset_exchange);

    let allBalance = ShowText.toFix(allZVC, 4, true)
    if (!allBalance || allBalance.length < 6) {
      allBalance = '0.0000'
    }

    return (
      <View style={styles.container}>
        <NavBar
          title={name}
          color='#fff'
          backgroundColor='rgba(0,0,0,0)'
          hideLine
          right={[{
            title: 'icon_change_wallet',
            onPress: () => NavigationService.navigate('WalletSwitch')
          }
          ]}></NavBar>


        <NavigationEvents onDidFocus={this.onDidFocus} onDidBlur={this.onDidBlur}></NavigationEvents>

        <View style={styles.topAsset}>
          <View style={styles.assetTopRow}>
            <Text style={styles.allAssetT}>{i18n.home_assets}</Text>
            <View style={styles.flex1}>

              <View style={styles.assetRow}>
                <BoldText style={styles.textValue}>
                  {!this.state.IsHiddenBalance
                    ? allBalance + ' ZVC'
                    : '*****'}
                </BoldText>

                <TouchableOpacity style={styles.eyeV} onPress={this.handleIsHidden}>
                  <Image
                    source={this.state.IsHiddenBalance
                      ? require('../../img/wallet/icon_home_biyan.png')
                      : require('../../img/wallet/icon_home_zhengyan.png')}></Image>
                </TouchableOpacity>

              </View>

              <Text style={styles.usdtValue}>{!this.state.IsHiddenBalance
                ? '≈ ' + usdtBalance + ' USDT'
                : '******'}</Text>
            </View>

          </View>
          <View style={styles.flex1}></View>
          <View style={styles.assetBottomV}>

            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(address);
                Toast(i18n.reload_copySuccess)
              }}>
              <View style={styles.copyView}>
                <Image source={require('../../img/wallet/icon_copyAddress.png')}></Image>
                <Text style={styles.copyText}>{i18n.reload_copyAddress}</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>
        <Shadow style={styles.buttonsShadow}>
          {coin_btns.map(item => {
            return <HomeBtn key={item.title} {...item} />
          })}
        </Shadow>

        <TouchableOpacity
          style={styles.handleMiddleBtn}
          onPress={this.haderlClickAllpages}>
          <Image
            source={this.state.isHiddenAllpages
              ? require('../../img/wallet/icon_allpages_open.png')
              : require('../../img/wallet/icon_homeclose.png')}></Image>
        </TouchableOpacity>

        {!this.state.isHiddenAllpages && <View style={styles.balanceV}>
          {this.renderBalance(i18n.wallet_canUseBalance, value, require('../../img/wallet/img_wallet_keyongbg.png'), this.onBalancePress)}
          {this.renderBalance(i18n.wallet_refundBalance, asset_refund, require('../../img/wallet/img_wallet_daituihuibg.png'), this.onRefundPress)}
          {this.renderBalance(i18n.wallet_stakeBalance, stakeAll, require('../../img/wallet/img_wallet_geshubg.png'), this.onStakePress)}
          {this.renderBalance(i18n.wallet_lendBalance, asset_lendStake, require('../../img/wallet/img_wallet_jiechubg.png'), this.onLoanPress)}
        </View>}

        <TopPadding></TopPadding>
        {this.allListComponent()}
        {this.state.showCheckView && <CheckView {...this.checkProps} onHide={this.onCheckViewPress} />}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  changeV: {
    position: 'absolute',
    left: 4,
    top: Config.statusBarHeight,
    padding: 11,
    alignItems: 'center',
    zIndex: 1000,
    flexDirection: 'row'
  },
  changeT: {
    fontSize: 13,
    color: '#fff'
  },
  topAsset: {
    backgroundColor: Config.appColor,
    width: Config.width,
    height: 164 + Config.navBarHeight,
    marginTop: -Config.navBarHeight - 2,
    paddingTop: Config.navBarHeight + 10,
    paddingHorizontal: 15
  },
  assetTopRow: {
    flexDirection: 'row'
  },
  flex1: {
    flex: 1
  },
  allAssetT: {
    fontSize: 20,
    color: '#fff',
    paddingRight: 5
  },
  assetRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  eyeV: {
    marginLeft: 15
  },
  textValue: {
    fontSize: 22,
    fontWeight: '500',
    color: "#fff"
  },
  decimalValue: {
    fontSize: 18,
    color: '#fff'
  },
  usdtValue: {
    fontSize: 12,
    color: '#fff',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
    marginRight: 15
  },
  buttonsShadow: {
    width: Config.width - 14,
    height: 100,
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: -50,
    padding: 10
  },
  handleMiddleBtn: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 15
  },
  balanceV: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: "#F5F5F5",
    padding: 10,
    paddingBottom: 0
  },
  balanceBg: {
    width: (Config.width - 40) / 2,
    height: 85,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 4,
    overflow: 'hidden'
  },
  balanceContent: {
    alignItems: 'center'
  },
  balanceTitle: {
    fontSize: 13,
    color: '#fff',
    paddingBottom: 10
  },
  balanceText: {
    fontSize: 15,
    color: '#fff'
  },
  FlatListBox: {
    width: Config.width,
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 100
  },
  copyView: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  copyText: {
    fontSize: 13,
    color: '#fff',
    paddingLeft: 4
  },
  assetBottomV: {
    marginBottom: 54,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  lockView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  lockText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#fff'
  }
});
export default connect(state => ({ wallet: state.wallet, minerInfo: state.minerInfo }), dispatch => ({
  createWallet: bindActionCreators(WalletAction.createWallet, dispatch),
  updateSelectedBalance: bindActionCreators(WalletAction.updateSelectedBalance, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch),
  updateSelectedBalance: bindActionCreators(WalletAction.updateSelectedBalance, dispatch),
  updateMinerInfoAction: bindActionCreators(MinerInfoAction.updateMinerInfoAction, dispatch)

}))(Page);
