import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Config, i18n } from '../unit/AllUnit';

import Wallet from './Wallet/Wallet';
import CreateOrImport from './Wallet/AddWallet/CreateOrImport';
import CreateWallet from './Wallet/AddWallet/CreateWallet';
import CreateWalletBackup from './Wallet/AddWallet/CreateWalletBackup';
import CreateWalletConfirm from './Wallet/AddWallet/CreateWalletConfirm';
import ImportWallet from './Wallet/AddWallet/ImportWallet';

import WalletManage from './Wallet/WalletManage';
import WalletReceive from './Wallet/WalletReceive';
import WalletTransfer from './Wallet/WalletTransfer';
import WalletSwitch from './Wallet/AddWallet/WalletSwitch';
import AddContract from './Wallet/Contract/AddContract';
import CallContract from './Wallet/Contract/CallContract';
import TransactionDetails from './Wallet/AddWallet/TransactionDetails'
import DevTool from './Wallet/Manager/DevTool';
import SwitchNetwork from './Wallet/Manager/SwitchNetwork';
import WalletMy from './Wallet/WalletMy/WalletMy';
import WalletDiscover from './Wallet/Discover/WalletDiscover';
import StakeList from './Wallet/pos/StakeList';
import Refund from './Wallet/pos/Refund';
import MsgWebView from './Wallet/WalletMy/MsgWebView';
import CommonSuccess from './Wallet/WalletMy/CommonSuccess';
import Miner from './Wallet/Discover/Miner';
import MinerStake from './Wallet/Discover/MinerStake';
import CreationPlan from './Wallet/Discover/CreationPlan';
import CreateZrc from './Wallet/Zrc/CreateZrc';
import Zrc from './Wallet/Zrc/Zrc';
import ZrcDetail from './Wallet/Zrc/ZrcDetail';
import ZrcTransfer from './Wallet/Zrc/ZrcTransfer';
import ZrcTxDetail from './Wallet/Zrc/ZrcTxDetail';
import ZrcTokenDetail from './Wallet/Zrc/ZrcTokenDetail';
import ScannerQRCode from './Wallet/AddWallet/ScannerQRCode';
import ContactService from './Wallet/WalletMy/ContactService';

const tabsImage = {
  Home: require('../img/tabbar/home.png'),
  Home_sel: require('../img/tabbar/home_sel.png'),
  WalletHome: require('../img/tabbar/home.png'),
  WalletHome_sel: require('../img/tabbar/home_sel.png'),

  Money: require('../img/tabbar/money.png'),
  My: require('../img/tabbar/my.png'),
  Money_sel: require('../img/tabbar/money_sel.png'),
  My_sel: require('../img/tabbar/my_sel.png'),
  WalletDiscover: require('../img/tabbar/icon_tab_found_unchoose.png'),
  WalletDiscover_sel: require('../img/tabbar/icon_tab_found_choose.png'),
  Zrc: require('../img/tabbar/icon_tab_jifen_unchoose.png'),
  Zrc_sel: require('../img/tabbar/icon_tab_jifen_choose.png'),
  Activity: require('../img/tabbar/icon_activity_unchoose.png'),
  Activity_sel: require('../img/tabbar/icon_activity_choose.png')
}

const WalletTab = createBottomTabNavigator({
  WalletHome: {
    screen: Wallet,
    navigationOptions: {
      tabBarLabel: i18n.tab1
    }
  },
  Zrc: {
    screen: Zrc,
    navigationOptions: {
      tabBarLabel: i18n.zrc_title
    }
  },
  WalletDiscover: {
    screen: WalletDiscover,
    navigationOptions: {
      tabBarLabel: i18n.tab_discover
    }
  },
  My: {
    screen: WalletMy,
    navigationOptions: {
      tabBarLabel: i18n.tab3
    }
  }
}, {
  defaultNavigationOptions: ({ navigation }) => ({

    tabBarIcon: ({ focused }) => {
      let { routeName } = navigation.state;
      routeName = focused
        ? routeName + '_sel'
        : routeName
      const img = tabsImage[routeName]
      return <Image source={img} style={{
        marginTop: 3
      }} />
    }
  }),
  tabBarOptions: {
    activeTintColor: Config.appColor,
    inactiveTintColor: '#999',
    allowFontScaling: false
  }
});

export default pages = {
  WalletTab,
  ScannerQRCode,
  Wallet,
  CreateOrImport,
  CreateWallet,
  ImportWallet,
  WalletManage,
  CreateWalletBackup,
  CreateWalletConfirm,
  WalletReceive,
  WalletTransfer,
  WalletSwitch,
  AddContract,
  CallContract,
  TransactionDetails,
  SwitchNetwork,
  DevTool,
  StakeList,
  Refund,
  MsgWebView,
  CommonSuccess,
  Miner,
  MinerStake,
  CreationPlan,
  CreateZrc,
  ZrcDetail,
  ZrcTransfer,
  ZrcTxDetail,
  ZrcTokenDetail,
  ContactService
}
