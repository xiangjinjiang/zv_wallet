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

  componentDidMount() {
    if (this.props.autoHide) {
      this.timer = setTimeout(() => {
        this.onHide()
      }, 3000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  onHide = () => {
    this
      .props
      .onHide();
    clearTimeout(this.timer)
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
      title = '',
      info = '',
      button = i18n.my_continue,
      onPress,
      children
    } = this.props;


    return <View style={styles.container}>
      <TouchableOpacity style={styles.flex1} onPress={this.onHide}>
        <View/>
      </TouchableOpacity>

      <View style={styles.bg}>

        <View style={styles.titleV}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={this.onHide} style={styles.img}>
            <Image source={require('../../../img/home/pwd_close.png')}/>
          </TouchableOpacity>
        </View>

        {info.length >= 0 && <Text style={styles.info}>{info}</Text>}
        {children}
       

        {onPress != null && <View style={styles.buttonV}>
          <TouchableOpacity style={styles.button} onPress={this.onHide}>
            <Text style={styles.cancelText}>{i18n.my_cancel}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>

        </View>}

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
  titleV: {
    alignItems: 'center',
    paddingLeft: 43,
    borderColor: '#D5D5D5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: Config.width - 30
  },
  title: {
    fontSize: 15,
    color: Config.appColor,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center'
  },
  img: {
    padding: 15
  },
  info: {
    paddingHorizontal: 32,
    paddingTop: 15,
    flex: 1,
    fontSize: 13,
    color: '#999'
  },
  buttonV: {
    marginTop: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
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