import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {NavBar, TopPadding, Button, ScrollTab, Shadow} from '../../../widget/AllWidget'
import {
  Config,
  post,
  i18n,
  NavigationService,
  ConstValue,
  UserData,
  ShowText,
  fullUrlRequest,
  Toast
} from '../../../unit/AllUnit';
import WalletAction from '../../../redux/actions/WalletAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import MinerInfoAction from '../../../redux/actions/MinerInfoAction';
import Confirm from '../view/Confirm';
import {NavigationEvents} from 'react-navigation';

const {
  TX_TYPE_STAKEADD,
  TX_TYPE_STAKEREFUND,
  TX_TYPE_STAKEREDUCE,
  TX_TYPE_ABORT,
  MINER_TYPE_VERIFIER,
  MINER_TYPE_PROPOSER
} = ConstValue

class Page extends Component {

  constructor(props) {
    super(props);

    this.state = {
      proCount: 0,
      proMaxStake: 0,
      proMinStake: 0,
      proMiddleStake: 0,
      proSumStake: 0,
      verCount: 0,
      verMaxStake: 0,
      verMinStake: 0,
      verMiddleStake: 0,
      verSumStake: 0,
      proposerTime: 0,
      verifierTime: 0,
      showConfirm: false,
      confirmTitle: '',
      confirmValue: 0
    }
    this.tabIndex = 0;
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  componentWillMount() {

    this.timer = setInterval(this.getData, 1000 * 20);
  }

  getData = () => {
    const {updateMinerInfoAction, updateGroupAction, updateNonce} = this.props;
    updateMinerInfoAction();
    updateGroupAction();
    updateNonce();

    const {address} = WalletAction.selectedAccount();
    fullUrlRequest(Config.PLEDGE_HOST + '/getRewardsTime', {
      address
    }, 'GET').then(data => {
      this.setState(data)
    })
    fullUrlRequest(Config.PLEDGE_HOST + '/assets/stakeInfo', {}, 'GET').then(data => {
      this.setState(data)
    })
  }

  minerStake = (tx_type) => {
    let m_type = this.tabIndex == 0
      ? MINER_TYPE_VERIFIER
      : MINER_TYPE_PROPOSER;
    const {stakeV, stakeP} = this.props.minerInfo;
    stakeValue = this.tabIndex == 0
      ? stakeV
      : stakeP;

    NavigationService.navigate('MinerStake', {m_type, tx_type, stakeValue});
  }

  onConfirmPress = () => {
    this.setState({showConfirm: false})
    UserData.authWalletPassword(this.onGetPassword)
  }
  onGetPassword = pwd => {
    let m_type = this.tabIndex == 0
      ? MINER_TYPE_VERIFIER
      : MINER_TYPE_PROPOSER;
    const {tx_type} = this.state;

    WalletAction.SignAndPost({
      tx_type: tx_type,
      m_type: m_type
    }, data => {
      if (data && data.error) {
        Toast(data.error.message || 'error')
      } else {
        NavigationService.navigate('CommonSuccess', {hash: data.result});
      }
    })
  }

  renderView = (title, left, right) => {

    return <Shadow
      top={100}
      left={100}
      source={require('../../../img/discover/bg_wakuangjiankong_all.png')}
      style={{
      width: Config.width - 14,
      height: 91 + left.length * 23,
      padding: 8
    }}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.view}>
        <View style={styles.leftView}>
          {left.map((item, key) => {
            return <Text key={key} style={styles.leftText}>{item}</Text>
          })}
        </View>
        <View style={styles.rightView}>
          {right.map((item, key) => {
            if (key == 0) {
              return <Text key={key} style={styles.activedText}>{item}</Text>
            }
            return <Text key={key} style={styles.rightText}>{item}</Text>
          })}
        </View>
      </View>
    </Shadow>
  }

  renderButtons = () => {
    const buttons = [
      {
        title: i18n.miner_reduce,
        img: require('../../../img/discover/icon_reducezhiya.png'),
        onPress: () => this.minerStake(TX_TYPE_STAKEREDUCE)
      }, {
        title: i18n.miner_refun,
        img: require('../../../img/discover/icon_tuihuizhiya.png'),
        onPress: () => {
          const {refundV, refundP} = this.props.minerInfo;
          let confirmValue = this.tabIndex == 0
            ? refundV
            : refundP;
          this.setState({tx_type: TX_TYPE_STAKEREFUND, showConfirm: true, confirmValue})
        }
      }, {
        title: i18n.miner_abort,
        img: require('../../../img/discover/icon_tingzhiwakuang.png'),
        onPress: () => this.setState({tx_type: TX_TYPE_ABORT, showConfirm: true, confirmValue: 0})
      }
    ];

    return <View style={styles.buttonV}>
      {buttons.map(item => {
        return <TouchableOpacity style={styles.button} key={item.title} onPress={item.onPress}>
          <Image source={item.img}/>
          <Text style={styles.buttonTitle}>{item.title}</Text>
        </TouchableOpacity>
      })}
    </View>
  }

  render() {
    const {address} = WalletAction.selectedAccount();
    const {
      stakeV,
      stakeP,
      refundV,
      refundP,
      miner_statusV,
      miner_statusP,
      groupCount,
      groupSelected,
      frozenHeightV,
      frozenHeightP,
      refundHeightV,
      refundHeightP
    } = this.props.minerInfo;
    const {
      proCount,
      proMaxStake,
      proMinStake,
      proMiddleStake,
      proSumStake,
      verCount,
      verMaxStake,
      verMinStake,
      verMiddleStake,
      verSumStake,
      proposerTime,
      verifierTime,
      tx_type,
      showConfirm,
      confirmValue
    } = this.state

    typeString = tx_type == TX_TYPE_STAKEREFUND
      ? i18n.wallet_tx_type6
      : i18n.wallet_tx_type4

    return (
      <View style={styles.container}>
        <NavBar
          title={i18n.discover_miner}
          right={[{
            title: 'icon_change_wallet',
            onPress: () => NavigationService.navigate('WalletSwitch')
          }
        ]}/>
        <NavigationEvents onDidFocus={this.getData}></NavigationEvents>

        <TopPadding></TopPadding>
        <View style={styles.top}/>
        <ScrollTab
          titles={[i18n.miner_v, i18n.miner_p]}
          onTabChanged={index => {
          this.tabIndex = index;
        }}>
          <ScrollView contentContainerStyle={styles.scroll}>
            {this.renderView(i18n.miner_allNet, [
              i18n.miner_allNetNode, i18n.miner_allNetStake, i18n.miner_allNetStakeMedian, i18n.miner_allNetStakeMax, i18n.miner_allNetStakeMin
            ], [
              verCount, verSumStake + ' ZVC',
              verMiddleStake + ' ZVC',
              verMaxStake + ' ZVC',
              verMinStake + ' ZVC'
            ])}

            {this.renderView(i18n.miner_self, [
              i18n.miner_selfStatus,
              i18n.miner_selfStake,
              i18n.miner_selfRefund,
              i18n.miner_selfReward,
              i18n.miner_selfGroupCount,
              i18n.miner_selfSelected
            ], [
              miner_statusV + MinerInfoAction.getTimeMinute(frozenHeightV),
              ShowText.showZV(stakeV) + ' ZVC',
              ShowText.showZV(refundV) + ' ZVC' + MinerInfoAction.getTimeDay(refundHeightV),,
              ShowText.time2Text(verifierTime, 'yyyy-MM-dd hh:mm') || '--',
              groupCount,
              groupSelected
            ])}

          </ScrollView>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}>
            {this.renderView(i18n.miner_allNet, [
              i18n.miner_allNetNode, i18n.miner_allNetStake, i18n.miner_allNetStakeMedian, i18n.miner_allNetStakeMax, i18n.miner_allNetStakeMin
            ], [
              proCount, proSumStake + ' ZVC',
              proMiddleStake + ' ZVC',
              proMaxStake + ' ZVC',
              proMinStake + ' ZVC'
            ])}

            {this.renderView(i18n.miner_self, [
              i18n.miner_selfStatus, i18n.miner_selfStake, i18n.miner_selfRefund, i18n.miner_selfReward
            ], [
              miner_statusP + MinerInfoAction.getTimeMinute(frozenHeightP),
              ShowText.showZV(stakeP) + ' ZVC',
              ShowText.showZV(refundP) + ' ZVC' + MinerInfoAction.getTimeDay(refundHeightP),
              ShowText.time2Text(proposerTime, 'yyyy-MM-dd hh:mm') || '--'
            ])}

          </ScrollView>
        </ScrollTab>

        <View style={styles.flexWhite}>
          {this.renderButtons()}

          <TouchableOpacity
            onPress={() => this.minerStake(TX_TYPE_STAKEADD)}
            style={styles.addStake}>
            <Image source={require('../../../img/discover/icon_xinzengzhiya.png')}/>
            <Text style={styles.stakeTitle}>{i18n.miner_add}</Text>
          </TouchableOpacity>
        </View>

        {showConfirm && <Confirm
          title={typeString}
          info={typeString}
          value={confirmValue}
          address={address}
          target={address}
          gas={(500 * 500)}
          onPress={this.onConfirmPress}
          onHide={() => this.setState({showConfirm: false})}/>}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroll: {
    paddingTop: 10,
    width: Config.width,
    alignItems: 'center',
    paddingBottom: 200
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    margin: 15,
    marginTop: 8
  },
  view: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 15
  },
  leftView: {
    alignItems: 'flex-end'
  },
  rightView: {},
  leftText: {
    fontSize: 12,
    color: '#333',
    height: 23,
    marginRight: 15
  },
  rightText: {
    fontSize: 12,
    color: '#999',
    height: 23
  },
  activedText: {
    fontSize: 12,
    color: Config.appColor,
    fontWeight: '500',
    height: 23
  },

  top: {
    width: 77,
    height: 10
  },
  buttonV: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 10
  },
  button: {
    flex: 1,
    alignItems: 'center'
  },
  buttonTitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4
  },
  addStake: {
    width: Config.width - 30,
    margin: 15,
    marginBottom: 30,
    backgroundColor: Config.appColor,
    height: 44,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center'
  },
  stakeTitle: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 10
  },
  flexWhite: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }

});

export default connect(state => ({minerInfo: state.minerInfo, wallet: state.wallet}), dispatch => ({
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch),
  updateMinerInfoAction: bindActionCreators(MinerInfoAction.updateMinerInfoAction, dispatch),
  updateGroupAction: bindActionCreators(MinerInfoAction.updateGroupAction, dispatch)
}))(Page);
