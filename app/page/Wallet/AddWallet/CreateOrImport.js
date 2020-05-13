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
import {NavBar, Button, TopPadding} from '../../../widget/AllWidget'
import {Config, NavigationService, i18n, UMAnalyticsModule} from '../../../unit/AllUnit';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onCreatePress = () => {
    NavigationService.navigate('CreateWallet');
    UMAnalyticsModule.onEvent('1');
  }
  onImportPress = () => {
    NavigationService.navigate('ImportWallet', {isFirst: true});
    UMAnalyticsModule.onEvent('2');
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_onChain}/>
        <TopPadding/>
        <Image
          style={styles.img}
          source={require('../../../img/wallet/create_wallet.png')}/>
        <Text style={styles.text}>{i18n.wallet_add_noInfo}</Text>
        <View style={styles.buttons}>
          <Button style={styles.left} onPress={this.onCreatePress}>{i18n.wallet_add_create}</Button>
          <Button style={styles.button} onPress={this.onImportPress}>{i18n.wallet_add_import}</Button>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff'
  },
  img: {
    marginTop: 67,
    marginBottom: 15
  },
  text: {
    fontSize: 14,
    color: '#666'
  },
  buttons: {
    flexDirection: "row",
    flex: 1,
    width: Config.width,
    paddingBottom: 100
  },
  left: {
    width: (Config.width - 45) / 2,
    marginLeft: 15,
    margin: 0,
    alignSelf: 'flex-end'
  },
  button: {
    width: (Config.width - 45) / 2,
    backgroundColor: '#fff',
    borderRadius: 4,
    color: Config.appColor,
    borderColor: Config.appColor,
    borderWidth: 1,
    marginLeft: 15,
    margin: 0,
    alignSelf: 'flex-end'
  }
});