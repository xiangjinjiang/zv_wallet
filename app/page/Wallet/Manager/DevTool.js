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
import {NavBar, TopPadding, CommonCell} from '../../../widget/AllWidget'
import {Config, NavigationService, i18n} from '../../../unit/AllUnit';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const const_data = [
      {
        left: i18n.wallet_deploy,
        arrow: true,
        pushTo: 'AddContract'
      }, {
        left: i18n.wallet_call,
        pushTo: 'CallContract',
        arrow: true
      }, {
        left: i18n.wallet_network,
        pushTo: 'SwitchNetwork',
        arrow: true
      }
    ]
    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_my_dev}/>
        <TopPadding></TopPadding>
        {const_data.map((item, key) => {
          return <TouchableOpacity
            onPress={() => NavigationService.navigate(item.pushTo)}
            key={key}>
            <CommonCell {...item}/>
          </TouchableOpacity>
        })}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});