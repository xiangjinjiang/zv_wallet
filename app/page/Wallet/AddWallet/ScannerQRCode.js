import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {NavBar} from '../../../widget/AllWidget'
import {Config, i18n} from '../../../unit/AllUnit';
import Barcode from 'react-native-smart-barcode'

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  _onBarCodeRead = (e) => {
    console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`)
    this._stopScan()
    if (this.props.navigation.state.params) 
      this.props.navigation.state.params.callBack(e.nativeEvent.data.code)
    this
      .props
      .navigation
      .goBack();
  }

  _startScan = (e) => {
    this
      ._barCode
      .startScan()
  }

  _stopScan = (e) => {
    this
      ._barCode
      .stopScan()
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={i18n.send_qrTitle} hideLine/>
        <View style={styles.view}>
          <Barcode
            style={styles.view}
            ref={component => this._barCode = component}
            onBarCodeRead={this._onBarCodeRead}/>
        </View>

        <Text style={styles.text}>{i18n.send_qrInfo}</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.bgColor
  },

  view: {
    flex: 1
  },

  text: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    position: 'absolute',
    bottom: (Config.height - 255 - 150) / 2,
    left: 0,
    right: 0
  }

});