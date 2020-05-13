import React, { Component } from 'react';
import {
  StatusBar,
  AsyncStorage,
  DeviceEventEmitter,
  View,
  BackHandler,
  AppState,
  ToastAndroid,
  Animated,
  Easing,
  findNodeHandle,
  StyleSheet,
  NetInfo
} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen'
import Pages from './Pages';
import {
  AppUpdate,
  Config,
  Toast,
  i18n,
  NavigationService,
  UserData,
  UMAnalyticsModule,
  fullUrlRequest,
  TxManager
} from '../unit/AllUnit';
import { WalletPassword, RootTopView } from '../widget/AllWidget';
import Picker from 'react-native-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import WalletAction from '../redux/actions/WalletAction';
import ZrcAction from '../redux/actions/ZrcAction';

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

class RootNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rootPage: '',
      showBlue: false, //是否模糊
    };

    this.lastBackPressTime = 0
    this.lastBackgroundTime = 0
  }

  initHome = (haveWallet) => {
    AsyncStorage.multiGet([
      'user', 'ip', Config.saveIPKey
    ], (err, object) => {
      let rootPage = 'CreateOrImport';
      let user = object[0][1];
      const ip = object[1][1];
      let ipConfig = object[2][1];

      if (haveWallet) {
        rootPage = 'WalletTab';
      }

      if (ipConfig) {
        ipConfig = JSON.parse(ipConfig);
        UserData.updateIp(ipConfig)
      } else {
        UserData.updateIp(Config.ipConfig)
      }
      UserData.updateIp(Config.ipConfig)

      this.setState({ rootPage })
      SplashScreen.hide();
      this.updateIPConfig();
    })

  }

  updateIPConfig = () => {
    fullUrlRequest(Config.PLEDGE_HOST + "/env/getConf", {}, 'GET').then(data => {
      UserData.updateIp(data)
    })
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo
      .isConnected
      .fetch()
      .then(isConnected => {
        !isConnected && Toast(i18n.toast_noNetwork)
      });
    AppUpdate();
    this
      .props
      .initWallet(this.initHome);
    this
      .props
      .initZrc();
    TxManager.initPaddingList(this.props.addZrc)

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {

    if (nextAppState == 'inactive' || nextAppState == 'background') { } else if (nextAppState == 'active') {
      DeviceEventEmitter.emit(Config.eventUpdateHomeData)
      // this.setState({showBlue: false});
    }
  }

  // 安卓点击设备返回按钮
  handleBackPress = () => {
    const now = new Date().getTime()
    if (now - this.lastBackPressTime < 1000 * 2)
      return false
    this.lastBackPressTime = now
    ToastAndroid.showWithGravity(i18n.toast_clickQuit, ToastAndroid.SHORT, ToastAndroid.CENTER);
    return true
  }

  render() {

    if (this.state.rootPage.length == 0)
      return null;
    const MainNavigator = createStackNavigator(Pages, {
      defaultNavigationOptions: {
        header: null
      },
      cardStyle: {
        backgroundColor: '#fff'
      },
      initialRouteName: this.state.rootPage,
      transitionConfig: () => ({
        transitionSpec: {
          duration: 300,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing
        }
      })
    });
    const App = createAppContainer(MainNavigator);
    const prevGetStateForActionHomeStack = MainNavigator.router.getStateForAction;
    MainNavigator.router.getStateForAction = (action, state) => {
      if (state && action.type === 'DeleteRoute') {
        const { routeName } = action;
        const routes = state
          .routes
          .filter((item) => item.routeName != routeName);
        return {
          ...state,
          routes,
          index: routes.length - 1
        };
      }
      return prevGetStateForActionHomeStack(action, state);
    };

    return (
      <View style={{
        flex: 1
      }}>
        <StatusBar
          barStyle='light-content'
          translucent={true}
          backgroundColor='rgba(0,0,0,0)' />

        <App
          ref={appRef => NavigationService.setTopLevelNavigator(appRef)}
          onNavigationStateChange={(prevState, currentState) => {
            Picker.hide();
            const currentScene = getCurrentRouteName(currentState);
            const previousScene = getCurrentRouteName(prevState);
            if (previousScene !== currentScene) {
              UMAnalyticsModule.onPageEnd(previousScene);
              UMAnalyticsModule.onPageBegin(currentScene);
            }
          }}></App>
        <WalletPassword ref={ref => UserData.setWalletPasswordRef(ref)} />
        <RootTopView ref={ref => UserData.setRootTopViewRef(ref)} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

// export default RootNav
export default connect(state => ({}), dispatch => ({
  initWallet: bindActionCreators(WalletAction.initWallet, dispatch),
  initZrc: bindActionCreators(ZrcAction.initZrc, dispatch),
  addZrc: bindActionCreators(ZrcAction.addZrc, dispatch),
}))(RootNav)