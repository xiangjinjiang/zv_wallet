import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  NativeModules,
  ImageBackground,
  Image,
  View,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Config} from '../unit/AllUnit'

const imgs = {
  back: require('../img/navbar/back.png'),
  qrcode: require('../img/navbar/qrcode.png'),
  black: require('../img/navbar/black.png'),
  qrcode: require('../img/navbar/white_qrcode.png'),
  share: require('../img/navbar/icon_share.png'),
  white_qrcode: require('../img/navbar/white_qrcode.png'),
  more: require('../img/wallet/icon_list.png'),
  icon_record_zhiya: require('../img/navbar/icon_record_zhiya.png'),
  icon_change_wallet: require('../img/navbar/icon_change_wallet.png'),
  unlock: require('../img/navbar/icon_jifen_unlock.png'),
  lock: require('../img/navbar/icon_jifen_lock.png'),
  help: require('../img/navbar/icon_huodongguize.png'),
  teken_detail: require('../img/navbar/icon_detail.png')

}

class NavBar extends Component {

  isTab = () => {
    const parent = this
      .props
      .navigation
      .dangerouslyGetParent()
    const isTab = parent && parent.state && (parent.state.routeName === 'Tab' || parent.state.routeName === 'WalletTab');
    return isTab;
  }

  getLeft = left => {
    if (!this.isTab()) {
      left = left || {
        title: 'back'
      }
      left.onPress = left.onPress || this.props.navigation.goBack
    }
    return left
  }

  getRight = (right = []) => {
    return right
  }

  renderBtnContent = title => {
    const {
      color = '#fff'
    } = this.props
    if (imgs[title]) {
      return <Image style={styles.navImg} source={imgs[title]}/>
    }
    return <Text style={[styles.text, {
        color
      }]}>{title}</Text>
  }

  renderBtn = item => {
    if (!item) {
      return null
    }
    return <TouchableOpacity key={item.title} onPress={() => item.onPress()}>
      {this.renderBtnContent(item.title)}
    </TouchableOpacity>
  }

  render() {
    let {
      title,
      left,
      right,
      color = '#fff',
      backgroundColor = Config.appColor,
      hideLine = true,
      translucent = false 
    } = this.props;

    if (!title) 
      return null;
    
    left = this.getLeft(left)
    right = this.getRight(right)

    let marginBottom = 0;
    if (translucent) {
      backgroundColor = 'rgba(0,0,0,0)';
      marginBottom = -Config.navBarHeight;
      hideLine = true;
    }

    return (
      <View style={[styles.container, {
        backgroundColor,
        marginBottom
        }]}>

        <View style={styles.view}>
          <View>
            {this.renderBtn(left)}
          </View>

          <View>
            {right.map(this.renderBtn)}
          </View>
        </View>
        {!hideLine && <View style={styles.line}/>}

        <View style={styles.titleV}>
          <Text
            style={[styles.title, {
              color
            }]}
            numberOfLines={1}>{title}</Text>
        </View>

      </View>
    )
  }

}

export default withNavigation(NavBar)

const styles = StyleSheet.create({
  container: {
    height: Config.statusBarHeight + 44,
    width: Config.width,
    backgroundColor: Config.appColor,
    zIndex: 100,
    elevation: 1

  },
  bg: {
    flex: 1,
    resizeMode: 'stretch'
  },
  view: {
    marginTop: Config.statusBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44
  },

  navImg: {
    width: 44,
    height: 44,
    resizeMode: 'center'
  },
  titleV: {
    position: 'absolute',
    top: Config.statusBarHeight,
    left: 44,
    right: 44,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '400'
  },

  text: {
    color: '#fff',
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10
  },
  line: {
    height: 1,
    backgroundColor: Config.bgColor
  }

});