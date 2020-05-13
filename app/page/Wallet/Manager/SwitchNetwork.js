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
import {NavBar, TopPadding, Shadow} from '../../../widget/AllWidget'
import {Config, fullUrlRequest, i18n, UserData, Toast} from '../../../unit/AllUnit';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: Config.ipConfig
    };
  }

  onItemPress = item => {
    const {key} = item;

    if (!this.state.data[key] || !this.state.data[key].stake) {
      Toast('Unreleased');
      return;
    }
    if (item.key == Config.ipConfig.selectedNet) {
      return;
    }
    UserData.saveIpConfig({selectedNet: item.key});
    this.setState({})
  }

  componentWillMount() {
    fullUrlRequest(Config.PLEDGE_HOST + "/env/getConf", {}, 'GET').then(data => {
      UserData.updateIp(data)
      this.setState({data: data})
    })
  }

  renderItem = (item, k) => {
    const {name, key} = item;

    const selected = item.key == Config.ipConfig.selectedNet;

    return <TouchableOpacity key={k} onPress={() => this.onItemPress(item)}>
      <Shadow style={styles.shadow}>
        <View
          style={[
          styles.cell, {
            backgroundColor: selected
              ? 'rgba(1,1,1,0.1)'
              : '#fff'
          }
        ]}>
          <View style={styles.line}></View>
          <Text style={styles.name}>{name}</Text>
        </View>
      </Shadow>
    </TouchableOpacity>
  }

  render() {

    const titles_data = [
      {
        name: i18n.wallet_network_production,
        key: 'admin'
      }, {
        name: i18n.wallet_network_test1,
        key: 'kaiyang'
      }
    ];
    const {data} = this.state;
    if (data['admin'].stake && data['admin'].chains && data['admin'].chains.length) {} else {
      titles_data[0].name += i18n.wallet_network_unreleased
    }

    if (Config.isDev) {
      titles_data.push({name: '内部测试', key: 'yaoguang'})
    }

    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_network}/>
        <TopPadding></TopPadding>
        {titles_data.map(this.renderItem)}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  shadow: {
    width: Config.width - 16,
    height: 75,
    marginLeft: 8
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Config.width - 30,
    margin: 7,
    marginLeft: 7,
    marginRight: 14,
    flex: 1,
    borderRadius: 4
  },
  line: {
    width: 2,
    height: 56,
    borderRadius: 2,
    backgroundColor: 'rgba(56, 50, 118, 0.5)'
  },
  name: {
    fontSize: 14,
    color: '#666',
    paddingLeft: 10
  }
});