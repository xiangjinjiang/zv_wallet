import React, {Component} from 'react';
import {
  StyleSheet,
  PanResponder,
  ImageBackground,
  Image,
  View,
  FlatList
} from 'react-native';
import {Config} from '../../../unit/AllUnit';

let layoutX = 0
let layoutWidth = 0

class Widget extends Component {

  state = {
    progress: 0
  }

  componentWillMount = () => {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: this.onPanResponderMove,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。 一般来说这意味着一个手势操作已经成功完成。
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者 默认返回true。目前暂时只支持android。
        return true;
      }
    });
  }

  onPanResponderMove = (evt, gestureState) => {
    // 最近一次的移动距离为gestureState.move{X,Y} 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}

    if (this.props.allSeek == 0) {
      return
    }

    const x = parseFloat(gestureState.x0 + gestureState.dx) - 10
    let progress = (x - layoutX) / layoutWidth
    if (progress < 0) 
      progress = 0;
    else if (progress > 1) 
      progress = 1;
    this
      .props
      .onProgressChange(progress * this.props.allSeek)

  }

  _onLayout(event) {
    const {x, width} = event.nativeEvent.layout
    layoutX = parseFloat(x)
    layoutWidth = parseFloat(width)

  }

  render() {

    const {seek, allSeek, onProgressChange} = this.props
    let progress = 0
    if (allSeek > 0) {
      progress = seek / allSeek
    };

    let left = progress * progress_width
    left = left - (left % 5) - 5
    const right = progress_width - left
    if (left < 0) {
      left = 0
    }

    return <View
      {...this._panResponder.panHandlers}
      style={styles.view}
      onLayout={this._onLayout}>

      <View style={styles.bg}>
        <Image
          source={require('../../../img/wallet/progress_bg.png')}
          style={{
          width: left + 4,
          resizeMode: 'stretch'
        }}/>
        <View
          style={{
          width: progress_width - left - 10,
          height: 8,
          backgroundColor: '#D5D5D5'
        }}/>

      </View>
      <View
        style={{
        width: progress_width,
        height: 8,
        marginTop: -8
      }}>
        <Image
          source={require('../../../img/wallet/progress_1.png')}
          resizeMode='repeat'
          style={{
          width: progress_width + 10,
          height: 8
        }}/>
      </View>

    </View>
  }
}

const progress_width = Config.width - 60;

const styles = StyleSheet.create({
  view: {
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: progress_width
  },
  bg: {
    height: 8,
    width: progress_width,
    flexDirection: 'row',
    alignItems: 'center'
  },

  left: {
    height: 1,
    backgroundColor: Config.appColor
  },
  right: {
    flex: 1,
    height: 8,
    backgroundColor: '#ccc'
  }
})

export default Widget