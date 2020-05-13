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
import {NavBar, Button} from '../../../widget/AllWidget'
import {Config, NavigationService, Toast, i18n, UMAnalyticsModule} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';

class Page extends Component {

  constructor(props) {
    super(props);
    this.wallet = this.props.navigation.state.params.wallet;
    const {name, mnemonic, accounts} = this.wallet
    this.mnemonic_list = [];
    let words = [];
    if (mnemonic && mnemonic.length > 0) {
      this.mnemonic_list = mnemonic.split(' ')
      words = this
        .mnemonic_list
        .sort();
    }

    this.state = {
      words,
      selectWords: []
    };
  }

  onPress = () => {
    if (this.state.selectWords.join(' ') != this.wallet.mnemonic) {
      Toast(i18n.wallet_add_mnemonicErr);
      return;
    }
    setTimeout(() => {
      UMAnalyticsModule.onEvent('4');
      NavigationService.resetRoot('WalletTab');
      NavigationService.deleteRoute(['CreateOrImport', 'CreateWallet', 'CreateWalletBackup', 'CreateWalletConfirm']);
    }, 200);
    this
      .props
      .updateWallet({data: this.wallet})
  }

  onSelectWordPress = word => {
    const {words, selectWords} = this.state;
    const selectIndex = selectWords.indexOf(word)
    words.push(word)
    selectWords.splice(selectIndex, 1);
    this.setState({words, selectWords})
  }

  onWordPress = word => {
    const {words, selectWords} = this.state;
    const index = words.indexOf(word)
    words.splice(index, 1);
    selectWords.push(word)
    this.setState({words, selectWords})
  }

  renderWord = (word, k) => {
    return <TouchableOpacity
      key={k}
      onPress={() => this.onWordPress(word)}
      style={styles.wordV}>
      <Text style={styles.word}>{word}</Text>
    </TouchableOpacity>

  }

  renderSelectedWord = (word, k) => {
    return <TouchableOpacity
      key={k}
      onPress={() => this.onSelectWordPress(word)}
      style={styles.selectedWordV}>
      <Text style={styles.word}>{word}</Text>
    </TouchableOpacity>

  }

  render() {

    const {words, selectWords} = this.state;

    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_onChain}/>

        <View style={styles.padding}></View>

        <Text style={styles.title}>{i18n.wallet_add_confirmInfo}</Text>

        <View style={styles.box}>
          {selectWords.map(this.renderSelectedWord)}
        </View>

        <View style={styles.wordsV}>
          {words.map(this.renderWord)}
        </View>

        <Button onPress={this.onPress} style={styles.button}>{i18n.wallet_add_finish}</Button>
      </View>
    )
  }

}

const wordV = {
  borderRadius: 2,
  borderWidth: 1,
  borderColor: '#EBEBF2',
  padding: 3,
  height: 25,
  marginRight: 15,
  marginBottom: 15
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  padding: {
    height: 10,
    width: Config.width,
    backgroundColor: Config.bgColor
  },
  title: {
    fontSize: 13,
    color: '#333',
    fontWeight: 'bold',
    margin: 15
  },
  box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: "#EBEBF2",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EBEBF2',
    height: 210,
    width: Config.width - 30,
    margin: 15,
    marginTop: 0,
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexShrink: 4
  },
  wordV,
  selectedWordV: {
    ...wordV,
    borderColor: '#999'
  },
  word: {
    fontSize: 14,
    marginHorizontal: 10,
    color: '#999'
  },
  wordsV: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    flex: 1,
    justifyContent: 'center'
  },
  wordItem: {
    width: (Config.width - 60) / 3,
    alignItems: 'center'
  },
  selectItem: {
    width: (Config.width - 50) / 3,
    alignItems: 'center'
  },
  button: {
    marginBottom: 50
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch)
}))(Page)