import React, {Component} from 'react';
import {
  StyleSheet,

  Image,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import {Config, i18n} from '../../../unit/AllUnit'
import {Button} from '../../../widget/AllWidget'
import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Text,
  Stop
} from 'react-native-svg';
let AnimatedCircle = Animated.createAnimatedComponent(Circle)

export default class Page extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      circleFillAnimation: new Animated.Value(0),
      value: this.props.value
    };
    this.dasharray = [Math.PI * 2 * 24];
    // 这里是动画的映射关系
    this.circleAnimation = this
      .state
      .circleFillAnimation
      .interpolate({
        inputRange: [
          0, 100
        ],
        outputRange: [this.dasharray[0], 0]
      });

  }
  componentDidMount()
  {
    this.startAnimation();
  }
  startAnimation()
  {
    this
      .state
      .circleFillAnimation
      .setValue(0);
    Animated
      .spring(this.state.circleFillAnimation, {
      toValue: this.state.value, // 设置进度值，范围：0～100
      friction: 5, // 动画摩擦力
      tension: 35 // 动画张力
    })
      .start();
  }
  // gradientTransform="matrix(1 0 0 -1 -40 66.52)"  gradientTransform="matrix(0 1
  // -1 0 0 0 )"
  //
  render() {
    let {value} = this.state;
    let {styleList} = this.props;
    console.warn('value ==', value);

    return (
      <View style={{
        ...styleList
      }}>
        <Svg height="57" width="57">
          <Defs>
            <LinearGradient
              id="prefix__a"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientUnits="userSpaceOnUse">
              <Stop offset={0} stopColor="#72f1d9"/>
              <Stop offset={1} stopColor="#383276"/>
            </LinearGradient>
          </Defs>
          <Circle
            cx="50%"
            cy="50%"
            r="42%"
            stroke="#D5D5D5"
            strokeWidth="2"
            fill="transparent"/>
          <Text
            x='50%'
            y="60%"
            fontSize='14'
            stroke='#383276'
            textAnchor='middle'
            dominantDaseline='middle'>{value + "%"}</Text>
          <AnimatedCircle
            cx="50%"
            cy="50%"
            r="42%"
            origin="50,50"
            rotate="-90"
            stroke="url(#prefix__a)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={this.dasharray}
            strokeDashoffset={this.circleAnimation}></AnimatedCircle>
        </Svg>
      </View>
    );
  }
}
const styles = StyleSheet.create({container: {
    // transform: [   {     scale: 0.57   } ]
  }})