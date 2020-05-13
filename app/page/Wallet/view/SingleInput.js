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
import {Button} from '../../../widget/AllWidget'

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

    const {onHide, title, placeholder} = this.props

    return <View style={styles.container}>
      <TouchableOpacity style={styles.flex1} onPress={this.onHide}>
        <View/>
      </TouchableOpacity>

      <ImageBackground
        source={require('../../../img/wallet/bg_single_input.png')}
        resizeMode='stretch'
        style={styles.bg}>

        <Text style={styles.title}>{title}</Text>

        <TextInput
          placeholder={placeholder}
          autoCapitalize="none"
          autoFocus={true}
          style={styles.input}
          onChangeText={this.onChangeText}
          underlineColorAndroid='transparent'/>

        <View style={styles.flex1}/>
        <Button style={styles.button} onPress={this.onGetText}>{i18n.wallet_add_next}</Button>
      </ImageBackground>

      <TouchableOpacity style={styles.flex1} onPress={this.onHide}>
        <View/>
      </TouchableOpacity>
    </View>
  }
}

const textV = {
  flexDirection: 'row',
  height: 54,
  paddingHorizontal: 10,
  justifyContent: "space-between",
  backgroundColor: '#fff',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderColor: Config.borderColor
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
    height: 341,
    marginLeft: 15
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
  button: {
    marginBottom: 25,
    width: Config.width - 50
  }
})