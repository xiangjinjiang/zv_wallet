import Spinner from 'react-native-loading-spinner-overlay';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  View,
  Image,
  Easing
} from 'react-native';

export default class Page extends Component {
  state = {
    rotateValue: new Animated.Value(0)
  }

  componentDidMount() {
    this.rote()
  }

  rote = () => {
    const animation = Animated.timing(this.state.rotateValue, {
      toValue: 360,
      duration: 1200,
      easing: Easing.out(Easing.linear)
    })
    Animated
      .loop(animation)
      .start();
  }

  render() {
    const {
      showLoading,
      text = 'Loading'
    } = this.props;

    if (!showLoading) {
      return null;
    }

    return (
      <View style={styles.container}>

        <Animated.View
          style={[
          styles.wheel, {
            transform: [
              {
                rotate: this
                  .state
                  .rotateValue
                  .interpolate({
                    inputRange: [
                      0, 360
                    ],
                    outputRange: ['0deg', '360deg']
                  })
              }
            ]
          }
        ]}>

          <Image source={require('../img/navbar/img_loading.png')}/>
        </Animated.View>
        <Text style={styles.text}>{text}</Text>

      </View>
    )
  }

}

const wheelHeight = 150;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  wheel: {
    alignSelf: 'center',
    width: wheelHeight,
    height: wheelHeight,
    // alignItems: 'flex-end'
  },
  text: {
    color: '#fff',
    marginTop: -(wheelHeight + 15) / 2
  }
});