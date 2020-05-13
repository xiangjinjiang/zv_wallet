import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
import {Config, i18n, ConstValue} from '../../../unit/AllUnit'
import {InputWithAnimate} from '../../../widget/AllWidget'
import TransferProgress from './TransferProgress';
const {MIN_GAS_LIMIT, MIN_GAS_PRICE, TX_TYPE_TRANSEFER} = ConstValue;
import {BigNumber} from 'bignumber.js/bignumber';

export default class Page extends Component {

  constructor(props) {
    super(props);

    const {
      gas = '500',
      gasprice = MIN_GAS_PRICE + ''
    } = props

    this.state = {
      showSet: false,
      gas,
      gasprice
    };
  }

  allSeek = 5000;
  minSeek = 500;

  componentDidMount() {
    console.warn(this.state);

    this
      .props
      .onGasChange(this.state)
  }

  onGasLimitChange = gas => {
    gas = BigNumber(gas).toFixed()
    if (isNaN(gas)) 
      gas = ''
    this.setState({gas})
    this
      .props
      .onGasChange({
        ...this.state,
        gas
      });

  }

  onProgressChange = progress => {
    this.setState({
      gasprice: (progress | 0) + 500
    });
    this
      .props
      .onGasChange({
        ...this.state,
        gasprice: (progress | 0) + 500
      });
  }

  onSetPress = () => {
    this.setState({
      showSet: !this.state.showSet
    })
    this
      .props
      .onGasChange({
        ...this.state,
        showSet: !this.state.showSet
      });
  }

  render() {
    const {showSet, gas, gasprice} = this.state;

    return <View style={styles.gasSet}>
      <View style={styles.row}>
        <Text style={styles.text}>{i18n.wallet_transfer_minerGas}</Text>
        <Text style={styles.zvc}>{(gasprice * gas / 1e9).toFixed(4)}
          ZVC</Text>
      </View>
      <Text style={styles.gasText}>≈Gas({gas}) * Gas Price({gasprice}) RA</Text>

      <TouchableOpacity style={styles.set} onPress={this.onSetPress}>
        <Text style={styles.setText}>{i18n.wallet_transfer_set}</Text>
        <Image source={require('../../../img/home/bottom_arrow.png')}></Image>
      </TouchableOpacity>

      {showSet && <View style={styles.setV}>
        <TransferProgress
          onProgressChange={this.onProgressChange}
          seek={gasprice - this.minSeek}
          allSeek={this.allSeek - this.minSeek}></TransferProgress>
        <Text style={styles.gasPrice}>{gasprice}RA</Text>

        <InputWithAnimate
          width={Config.width - 30}
          inputProps={{
          value: gas,
          keyboardType: 'numeric',
          onChangeText: this.onGasLimitChange
        }}>gas Limit</InputWithAnimate>
      </View>}

    </View>
  }
}

const styles = StyleSheet.create({

  gasSet: {
    width: Config.width - 50,
    paddingTop: 10
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Config.width - 50,
    paddingVertical: 10
  },
  text: {
    fontSize: 15,
    color: '#333',
    width: 100,
    textAlign: 'right'
  },
  zvc: {

    fontSize: 13,
    color: Config.appColor
  },
  button: {
    marginBottom: 50,
    width: Config.width - 50
  },
  gasText: {
    alignSelf: 'flex-end',
    fontSize: 13,
    color: '#999',
    paddingLeft: 15
  },
  gasPrice: {
    fontSize: 13,
    color: Config.appColor,
    paddingTop: 5
  },
  set: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    alignSelf: 'flex-end',

    paddingTop: 10
  },
  setText: {
    color: Config.appColor,
    fontSize: 15,
    paddingRight: 8
  },
  setV: {
    padding: 15,
    alignItems: 'center',
    paddingBottom: 0
  }
});