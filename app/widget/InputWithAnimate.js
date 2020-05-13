import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, Animated} from 'react-native';
import {Config} from '../unit/AllUnit'

const const_height = 62;
const const_size = 15;

export default class Page extends Component {

  state = {
    height: new Animated.Value(const_height / 2)
  }

  onFocus = () => this.animateTo(const_size / 2);

  onBlur = (event) => {
    // const text = event.nativeEvent.text; if (text && text.length > 0) {   return;
    // } this.animateTo(const_height / 2);
  }

  animateTo = value => {
    if (this.animated) {
      return;
    }
    this.animated = true;
    Animated
      .spring(this.state.height, {
      toValue: value,
      duration: 400
    })
      .start();
  }

  render() {
    const {
      inputProps = {},
      width = Config.width
    } = this.props
    const title = this.props.children;
    if (inputProps.value) {
      this.animateTo(const_size / 2)
    }

    return (
      <View style={[styles.container, {
          width
        }]}>

        <View style={styles.inputV}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            {...inputProps}/>
        </View>

        <Animated.View
          pointerEvents='none'
          style={{
          position: 'absolute',
          top: this.state.height,
          marginLeft: 29,
          backgroundColor: "#fff",
          paddingHorizontal: 3
        }}>
          <Text style={styles.text}>{title}</Text>
        </Animated.View>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    width: Config.width,
    height: const_height,
    backgroundColor: "#fff",
    padding: 15,
    paddingBottom: 0,
    marginTop: 3
  },
  inputV: {
    flex: 1,
    height: 50,
    paddingTop: 7,
    borderRadius: 4,
    borderColor: '#D5D5D5',
    borderWidth: 1,
    paddingHorizontal: 15
  },

  input: {
    height: 40,
    fontSize: 15,
    color: "#333",
    alignItems: 'center'
  },
  text: {
    fontSize: const_size,
    color: "#666",
    height: const_size + 6
  }
});