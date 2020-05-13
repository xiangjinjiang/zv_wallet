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
import {NavBar, InputWithAnimate, Button} from '../../../widget/AllWidget'
import {Config, NavigationService, Toast, i18n, UMAnalyticsModule} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onNameChange = name => this.name = name;
  onPasswordChange = password => this.password = password;
  onPassword2Change = password2 => this.password2 = password2;

  componentWillMount() {}

  onPress = () => {

    const {name, password, password2, props} = this;
    if (!name) {
      Toast(i18n.wallet_add_nameErr);
      return
    }
    if (!password) {
      Toast(i18n.wallet_add_pwdErr);
      return
    }

    if (password.length > 16) {
      Toast(i18n.wallet_add_pwdToLong);
      return
    }

    if (password != password2) {
      Toast(i18n.pwd_newError);
      return
    }

    props.createWallet({name, password});
    UMAnalyticsModule.onEvent('3');
    NavigationService.navigate('CreateWalletBackup')
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_add_create}/>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <InputWithAnimate
            inputProps={{
            onChangeText: this.onNameChange
          }}>{i18n.wallet_add_name}</InputWithAnimate>
          <InputWithAnimate
            inputProps={{
            secureTextEntry: true,
            onChangeText: this.onPasswordChange
          }}>{i18n.wallet_add_pwd}</InputWithAnimate>
          <InputWithAnimate
            inputProps={{
            onChangeText: this.onPassword2Change,
            secureTextEntry: true
          }}>{i18n.wallet_add_pwd}</InputWithAnimate>
          <Button style={styles.button} onPress={this.onPress}>{i18n.wallet_add_next}</Button>
        </ScrollView>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.bgColor
  },
  scroll: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff'
  },
  button: {
    marginTop: 100
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  createWallet: bindActionCreators(WalletAction.createWallet, dispatch)
}))(Page)