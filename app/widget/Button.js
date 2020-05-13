import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import {Config} from '../unit/AllUnit'

export default class Page extends Component {

  lastPressTime = 0

  onPress = () => {
    if (this.props.disable) {
      return;
    }
    Keyboard.dismiss(); //收起键盘

    const time = new Date().getTime()

    if (time - this.lastPressTime > 1000) {
      this.lastPressTime = time
      this.props.onPress && this
        .props
        .onPress()
    }
  }

  render() {
    let {title, disable} = this.props
    if (!title) 
      title = this.props.children;
    if (!title) 
      return null;
    
    let viewStyle = defaultStyle

    //自定义button
    if (this.props.style) {
      let flatStyle = StyleSheet.flatten(this.props.style)
      viewStyle = {
        ...viewStyle,
        ...flatStyle
      }
    }
    let {
      fontSize,
      color,
      ...style
    } = viewStyle
    if (disable) {
      style.backgroundColor = '#ccc'
    }

    return (
      <TouchableOpacity onPress={this.onPress} style={style}>
        <View style={{
          justifyContent: 'center',
          flex: 1
        }}>
          <Text style={{
            fontSize,
            color
          }}>{this.props.children}</Text>
        </View>
      </TouchableOpacity>
    )
  }

}

const defaultStyle = {
  height: 44,
  alignItems: 'center',
  alignSelf: 'center',
  width: Config.width - 30,
  margin: 10,
  backgroundColor: Config.appColor,
  borderRadius: 4,
  fontSize: 16,
  color: 'white'
}
