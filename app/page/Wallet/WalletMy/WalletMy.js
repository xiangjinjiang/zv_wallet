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
import { Config, NavigationService, i18n, AppUpdate, UserData } from '../../../unit/AllUnit';
import { connect } from 'react-redux'
import WalletAction from '../../../redux/actions/WalletAction';
import DeviceInfo from 'react-native-device-info';
import TouchID from 'react-native-touch-id';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onTabPress = () => {
    NavigationService.switchToOffChain();
  }

  render() {

    const data = [
      {
        left: i18n.wallet_my_accountManager,
        onPress: () => NavigationService.navigate('WalletManage'),
        source: require('../../../img/wallet/icon_mine_lianxi.png')
      }, {
        left: i18n.wallet_my_dev,
        onPress: () => NavigationService.navigate('DevTool'),
        source: require('../../../img/wallet/icon_kaifazhe.png')
      },{
        left: i18n.join_title,
        onPress: () => NavigationService.navigate('ContactService'),
        source: require('../../../img/wallet/icon_mine_yinsi.png')
      }
    ];

    if (Config.TouchID) {
      let rightImage = require('../../../img/my/icon_unchoosetouchid.png');
      if (Config.userData.useTouchID) {
        rightImage = require('../../../img/my/icon_choosetouchid.png');
      }

      data.push({
        left: Config.TouchID,
        onPress: () => UserData.switchTouchId(() => this.setState({})),
        source: require('../../../img/my/icon_mine_touchid.png'),
        rightImage,
        arrow: false
      })
    }

    data.push({
      left: i18n.version_info,
      source: require('../../../img/my/icon_banbenxinxi.png'),
      right: 'v' + DeviceInfo.getVersion(),
      arrow: false,
      onPress: () => AppUpdate(true)
    })

    return (
      <View style={styles.container}>
        <NavBar title={i18n.tab3} />
        <TopPadding></TopPadding>
        {data.map(item => {
          return <TouchableOpacity key={item.left} onPress={item.onPress}>
            <CommonCell {...item} />
          </TouchableOpacity>
        })}

        <View style={styles.container}></View>


      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    marginBottom: 20
  }
});

export default connect(state => ({ wallet: state.wallet }), dispatch => ({}))(Page)
