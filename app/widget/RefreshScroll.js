/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import {Config} from '../unit/AllUnit'

export default class App extends Component {

  state = {
    isRefreshing: false
  }

  componentDidMount() {
    this.scrollTo(-100);

  }

  onRefresh() {
    this.props.onRefresh && this
      .props
      .onRefresh()
    setTimeout(() => {
      this.setState({isRefreshing: false})
      this.scrollTo(0);
    }, 1000);
  }

  scrollTo = y => {
    let scrollComponentRef = this.refs.scrollComponentRef
    scrollComponentRef && scrollComponentRef.scrollTo({y, animated: true})
  }

  render() {

    let onScrollEvent = (event) => {
      let y = event.nativeEvent.contentOffset.y
      if (y < -80 && !this.state.isRefreshing) {
        this.setState({isRefreshing: true})
        this.scrollTo(-80);
        this.onRefresh()
      }
    };

    const animationStyle = {
      position: 'absolute',
      top: -50,
      right: 0,
      left: 0,
      width: Config.width,
      height: 50
    }

    return (
      <View style={styles.container}>
        <ScrollView
          ref='scrollComponentRef'
          showsVerticalScrollIndicator={false}
          onScroll={onScrollEvent}
          scrollEventThrottle={3}
          overScrollMode='never'
          scrollEnabled={!this.state.isRefreshing}>
          {this.state.isRefreshing && <ActivityIndicator
            style={animationStyle}
            color={Config.appColor}
            animating={true}/>}
          {this.props.children}
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
