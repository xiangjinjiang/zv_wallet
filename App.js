/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import 'react-native-gesture-handler'
import React, { Component } from 'react';
import { Text, TextInput, Platform } from 'react-native';
import RootNav from './app/page/RootNav';
import { Provider } from 'react-redux';
import ConfigureStore from './app/redux/store/ConfigureStore';
import _ from 'lodash'

const store = ConfigureStore();
const textProps = {
  allowFontScaling: false
}
if (Platform.OS == 'android') {
  textProps.fontFamily = 'Robot';
}

TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { allowFontScaling: false })
Text.defaultProps = Object.assign({}, Text.defaultProps, textProps)
// console.warn = console.log;

class App extends Component {
  render() {
    return <Provider store={store}>
      <RootNav />
    </Provider>
  }
}

export default App;