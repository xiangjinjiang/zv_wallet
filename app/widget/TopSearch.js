import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Keyboard
} from 'react-native';
import {Config, i18n} from '../unit/AllUnit';

export default class VideoCell extends Component {

  state = {
    showCancel: false,
    value: ''
  }

  onFocus = () => {
    this.setState({showCancel: true});
  }

  onBlur = () => {
    if (this.state.value == '') {
      const {placeholder, onCancel} = this.props;
      this.setState({showCancel: false, value: ''});
      onCancel && onCancel();
    }
  }

  onChangeText = value => {
    const {onChangeText} = this.props;
    onChangeText && onChangeText(value);
    this.setState({value})
  }

  render() {

    const {placeholder, onCancel} = this.props;
    const {showCancel, value} = this.state;

    return (
      <View style={styles.view}>
        <View style={styles.inputView}>
          <Image style={styles.searchImg} source={require('../img/home/search.png')}/>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            placeholder={placeholder}
            onChangeText={this.onChangeText}
            onBlur={this.onBlur}
            value={value}
            onFocus={this.onFocus}
            paddingVertical={0}
            underlineColorAndroid='transparent'></TextInput>
        </View>
        {showCancel && <TouchableOpacity
          onPress={() => {
          this.setState({showCancel: false, value: ''});
          Keyboard.dismiss();
          onCancel && onCancel();
        }}>
          <Text style={styles.cancel}>{i18n.my_cancel}</Text>
        </TouchableOpacity>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    width: Config.width,
    height: 55,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 4
  },
  searchImg: {
    margin: 10
  },
  input: {
    fontSize: 14,
    height: 35,
    flex: 1
  },
  cancel: {
    padding: 10,
    color: Config.appColor,
    fontSize: 14
  }
});