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
import {Config} from '../unit/AllUnit'

export default class Page extends Component {

  lastPressTime = 0

  onPress = () => {
    const time = new Date().getTime()

    if (time - this.lastPressTime > 1000) {
      this.lastPressTime = time
      this.props.onPress && this
        .props
        .onPress()
    }
  }

  render() {
    let {title, color, backgroundColor} = {
      ...this.props
    }
    if (!title) 
      title = this.props.children;
    if (!title) 
      return null;
    
    let defaultStyle = {
      height: 50,
      backgroundColor,
      alignItems: 'center',
      alignSelf: 'center'
    }

    const textStyle = {
      fontSize: 20,
      color
    }
    if (Config.isIos && Config.statusBarHeight > 30) {
      defaultStyle.height += 10
      textStyle.marginBottom = 10
    }

    return (

      <TouchableOpacity onPress={this.onPress} style={defaultStyle}>
        <View style={{
          justifyContent: 'center',
          flex: 1
        }}>
          <Text style={textStyle}>{this.props.children}</Text>
        </View>
      </TouchableOpacity>

    )
  }

}

Page.defaultProps = {
  color: 'white',
  backgroundColor: Config.appColor
}
