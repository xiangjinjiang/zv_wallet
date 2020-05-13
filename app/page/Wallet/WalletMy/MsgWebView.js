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
import {WebView} from 'react-native-webview';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    const params = this.props.navigation.state.params;
    if (params) {
      this.url = params.url;
      this.title = params.title || 'ZVChain';
      this.source = params.source;
    }
    if (!this.source) {
      this.source = {
        uri: this.url
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={this.title}/>
        <WebView
          source={this.source}
          originWhitelist={['*']}
          style={{
          backgroundColor: '#fff'
        }}/>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});