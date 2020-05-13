import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Linking,
  Image,
  View,
  TouchableOpacity,
  Clipboard,
  ScrollView
} from 'react-native';
import { NavBar, Shadow, TopPadding } from '../../../widget/AllWidget'
import { Config, i18n, Toast } from '../../../unit/AllUnit';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onLinkPress = item => {
    if (item.link == 'ZVChain') {
      Clipboard.setString('ZVChain');
      Toast(i18n.reload_copySuccess)
      return;
    }

    Linking.openURL(item.link)
  }

  renderItem = item => {
    return <Shadow style={styles.shadow} key={item.title}>
      <Image
        style={styles.bg}
        source={require('../../../img/my/contact/img_shequn_iconBg.png')} />
      <Image style={styles.img} source={item.icon} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.link} onPress={() => this.onLinkPress(item)}>{item.link}</Text>
    </Shadow>
  }

  /*
   {
        icon: require('../../../img/my/contact/icon_weixin.png'),
        title: 'Wechat' + i18n.join_gzh,
        link: 'ZVChain'
      }, {
        icon: require('../../../img/my/contact/icon_weibo.png'),
        title: 'Weibo：',
        link: 'https://weibo.com/p/1006066583847871'
      },
  */

  render() {
    const data = [
      {
        icon: require('../../../img/my/contact/icon_telegram.png'),
        title: 'Telegram' + i18n.join_en,
        link: 'https://t.me/ZVChain_Official'
      }, {
        icon: require('../../../img/my/contact/icon_telegram.png'),
        title: 'Telegram' + i18n.join_zh,
        link: 'https://t.me/ZVchain_CN'
      }, {
        icon: require('../../../img/my/contact/icon_twitter.png'),
        title: 'Twitter：',
        link: 'https://twitter.com/zv_chain'
      }, {
        icon: require('../../../img/my/contact/icon_medium.png'),
        title: 'Medium：',
        link: 'https://medium.com/zvchain'
      }, {
        icon: require('../../../img/my/contact/icon_bit.png'),
        title: 'Bitcointalk：',
        link: 'https://bitcointalk.org/index.php?topic=5166349.0'
      }, {
        icon: require('../../../img/my/contact/icon_git.png'),
        title: 'GitHub：',
        link: 'https://github.com/zvchain'
      }, {
        icon: require('../../../img/my/contact/icon_reddit.png'),
        title: 'Reddit：',
        link: 'https://www.reddit.com/r/ZVChain_ZVC/'
      }
    ];
    return (
      <View style={styles.container}>
        <NavBar title={i18n.join_title} />
        <TopPadding></TopPadding>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {data.map(this.renderItem)}
        </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    paddingTop: 5,
    alignItems: "center",
    paddingBottom: 50
  },
  shadow: {
    width: Config.width - 10,
    height: 74,
    flexDirection: 'row',
    alignItems: "center",
    paddingRight: 10,
    marginBottom: -5
  },
  bg: {
    marginLeft: -5
  },
  img: {
    marginLeft: -38
  },
  title: {
    marginLeft: 23,
    color: '#999999',
    fontSize: 12
  },
  link: {
    color: Config.appColor,
    fontSize: 13,
    flex: 1
  }
});