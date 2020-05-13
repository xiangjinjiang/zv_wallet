import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

export default class Page extends Component {

  state = {
    show: false
  }

  onShow = children => {
    this.children = children;
    this.setState({show: true})
  }

  onHide = () => {
    this.setState({show: false})
  }

  render() {
    if (this.state.show == false) {
      return null;
    }

    return <View style={styles.container}>
      {this.children}

    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})