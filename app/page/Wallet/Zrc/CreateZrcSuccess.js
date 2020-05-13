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
import ZrcAction from '../../../redux/actions/ZrcAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.timer = setTimeout(NavigationService.pop, 3000);
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={i18n.success}/>
        <Image
          source={(require('../../../img/wallet/icon_success_allpage.png'))}
          style={styles.img}/>
        <Text style={styles.text}>{i18n.success}</Text>
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
  }
});

export default connect(state => ({}), dispatch => ({
  addZrc: bindActionCreators(ZrcAction.addZrc, dispatch)
}))(Page)
