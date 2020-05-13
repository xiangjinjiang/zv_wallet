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
import {Config, i18n} from '../../../unit/AllUnit'
import {Button, InputWithAnimate} from '../../../widget/AllWidget'

export default class Page extends Component {

  state = {}

  onHide = () => {
    this
      .props
      .onHide()
  }

  onChangeText = text => {
    this.text = text
  }

  onGetText = () => {
    const {props, text} = this
    props.onHide(text)
  }

  render() {
    const {
      onHide,
      title = i18n.wallet_manager_password,
      placeholder = i18n.wallet_manager_password,
      secureTextEntry = true
    } = this.props;

    return <View style={styles.container}>
      <TouchableOpacity style={styles.flex1} onPress={this.onHide}>
        <View/>
      </TouchableOpacity>

      <View style={styles.bg}>

        <TouchableOpacity onPress={this.onHide} style={styles.img}>
          <Image source={require('../../../img/home/pwd_close.png')}/>
        </TouchableOpacity>

        <InputWithAnimate
          width={Config.width - 30}
          inputProps={{
          placeholder: placeholder,
          autoFocus: true,
          onChangeText: this.onChangeText,
          secureTextEntry
        }}>{title}</InputWithAnimate>
        <View style={styles.buttonV}>
          <TouchableOpacity style={styles.button} onPress={this.onHide}>
            <Text style={styles.cancelText}>{i18n.my_cancel}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.onGetText}>
            <Text style={styles.buttonText}>{i18n.my_continue}</Text>
          </TouchableOpacity>

        </View>

      </View>

      <TouchableOpacity style={styles.flex1} onPress={this.onHide}>
        <View/>
      </TouchableOpacity>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  flex1: {
    flex: 1
  },
  bg: {
    width: Config.width - 30,
    height: 190,
    marginLeft: 15,
    backgroundColor: '#fff',
    borderRadius: 4

  },
  img: {
    alignSelf: 'flex-end',
    padding: 15,
    marginBottom: 5
  },
  title: {
    marginLeft: 50,
    marginTop: 54,
    color: "#fff",
    fontSize: 15,
    marginBottom: 15
  },
  input: {
    width: Config.width - 100,
    height: 50,
    marginLeft: 30
  },
  buttonV: {
    marginTop: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    backgroundColor: '#fff',
    margin: 15
  },
  buttonText: {
    color: Config.appColor,
    fontSize: 17
  },
  cancelText: {
    color: '#666',
    fontSize: 17
  }
})