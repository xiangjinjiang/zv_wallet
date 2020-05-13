import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Animated
} from 'react-native';
import {Config, i18n} from '../../../unit/AllUnit'
import { Button, InputWithAnimate } from '../../../widget/AllWidget'
import LottieView from 'lottie-react-native';

LayoutAnimation.configureNext(
  {
    duration: 3000, create: { type: 'linear', property: 'opacity' },
 }
)

export default class Page extends Component {

  state = {
    show: true,
    showLottie:false,
    animatedValue: new Animated.Value(0),
  }

  useAdnimated = true;

  packetVStyle = {
    position: 'absolute',
    left: Math.random() * (Config.width - 60),
    width: 150,
    height: 150,
    top:-80,
    alignItems:'flex-start'
  }
  packetSource = Math.random() > 0.5 ? require('../../../img/activity/red_packet1.png') :require('../../../img/activity/red_packet2.png')

  componentDidMount() {
    const { delay } = this.props;

    Animated.timing(       
      this.state.animatedValue,    
      {
        toValue: Config.height+200,
        duration:3000,
        delay: delay * 500,
        useNativeDriver:true
      },         
    ).start();      
   
  }

  onPress = () => {
    if (this.state.show == false) {
      return;
    }
    this.setState({ show: false, showLottie: true })
    this.state.animatedValue.stopAnimation();
  }

  render() {

    const { show, showLottie } = this.state;



    if (!show && !showLottie) {
      return null;
    }

  
    return <Animated.View style={[this.packetVStyle, {
      transform: [{
        translateY: this.state.animatedValue,
      }],
    }]} scrollEventThrottle={3}>
      {show && <TouchableOpacity onPress={this.onPress}>
        <Image source={this.packetSource} style={styles.packet}></Image>
      </TouchableOpacity>}
      
      {showLottie && <LottieView
        source={require('../../../img/json/bomb.json')}
        autoPlay
        resizeMode='cover'/>}
          </Animated.View>
        }

}

const styles = StyleSheet.create({

  packet: {
    width: 59,
    height: 73,
    resizeMode:'contain'
  },
})