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
import {NavBar, TopPadding, Button} from '../../../widget/AllWidget'
import {Config, post, i18n, NavigationService} from '../../../unit/AllUnit';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    const params = this.props.navigation.state.params;
    this.buttonText = ""
    if (params) {
      this.info = params.info || ''

      const {buttonText, callback} = params;
      if (buttonText && buttonText.length) {
        this.buttonText = buttonText;
        this.callback = callback;
      }
    }
  }

  componentDidMount() {
    this.timer = setTimeout(NavigationService.pop, 3000);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
    const params = this.props.navigation.state.params;
    if (params && params.disappear) {
      params.disappear();
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <NavBar title={i18n.success}/>
        <Image
          source={(require('../../../img/wallet/icon_success_allpage.png'))}
          style={styles.img}/>
        <Text style={styles.text}>{i18n.success}</Text>
        <Text style={styles.info}>{this.info }</Text>
        <View style={styles.container}></View>

        {this.buttonText.length > 0 && <Button
          style={styles.button}
          onPress={() => {
          this.callback();
          clearTimeout(this.timer);
          NavigationService.deleteRoute('CommonSuccess')
        }}>{this.buttonText}</Button>}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  img: {
    marginTop: 114
  },
  text: {
    marginTop: 24,
    fontSize: 15,
    color: Config.appColor,
    paddingHorizontal: 15,
    fontWeight: '500'
  },
  info: {
    marginTop: 24,
    fontSize: 13,
    color: '#999',
    lineHeight:16
  },
  button: {
    marginBottom: 65
  }
});