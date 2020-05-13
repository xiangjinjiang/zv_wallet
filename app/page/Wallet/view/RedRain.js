import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import {NavBar, BoldText, Button} from '../../../widget/AllWidget'
import {Config, fullUrlRequest, i18n, NavigationService,ShowText, UserData} from '../../../unit/AllUnit';
import WalletAction from '../../../redux/actions/WalletAction';
import CryptoJS from 'crypto-js';
import RedPacket from './RedPacket';

const MD5 = CryptoJS.MD5;
const packetCount = 20;

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      countDown: 5,
      amount: '',
      gameOver:false
    };

  }

  componentWillMount() {
    this.interval = setInterval(() => {
      const countDown = this.state.countDown - 1;
      if (countDown <= 0) {
        clearInterval(this.interval);
        this.getAmount()
      } 
      this.setState({countDown})
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }
  
  getAmount = () => {
    const { address } = WalletAction.selectedAccount();
    const secret = ShowText.rainMD5(address)

    fullUrlRequest(Config.PLEDGE_HOST + '/redEnvelopes/participateIn', {
      address, secret
    }, 'GET').then(data => {
      const { id } = data;
      this.setState(data);
      const { rainCount} = Config.userData;

      if (id == rainCount.id ) {
        rainCount.count = rainCount.count+1
      } else {
        rainCount.id = id;
        rainCount.count = 1;
      }
      console.warn(rainCount);

      UserData.updateUserData({rainCount})
    });

    this.timeout = setTimeout(() => {
      this.setState({ gameOver: true });
    }, (packetCount+3)*500);
  }

  onHide = () => {
    UserData.rootTopViewRefHide();
  }

  renderView = text => {
    return <ImageBackground
    source={require('../../../img/activity/img_alert_qiandao.png')}
    style={styles.couponV}
    resizeMethod='auto'>

    <View style={styles.flex1}></View>
    <Image
      source={Config.isZh
      ? require('../../../img/activity/hongbaoyu_wenzi_cn.png')
      : require('../../../img/activity/hongbaoyu_wenzi_en.png')}
      style={styles.titleImg}></Image>
      <BoldText style={styles.countDownText}>{text}</BoldText>
      
      <TouchableOpacity
        style={styles.closeV}
        onPress={this.onHide}>
      <Image source={require('../../../img/activity/icon_close_tiyan.png')}></Image>
    </TouchableOpacity>
    </ImageBackground>
  }

  renderOverView = amount => {
   return <ImageBackground
    source={require('../../../img/activity/img_alert_jiangli.png')}
    style={styles.couponV}
    resizeMethod='auto'>
    <View style={styles.flex1}></View>

      <View style={styles.amountV}>
        <View style={styles.flex18}></View>
        <View>
          <BoldText style={styles.amountT}>{amount}</BoldText>
          <Text style={styles.zvc}>ZVC</Text>
        </View>
        <View style={styles.flex10}></View>
      </View> 

      <Text style={styles.congratulationT}>{i18n.rain_congratulation1}{amount}{i18n.rain_congratulation2}</Text>
      
      <TouchableOpacity
        style={styles.congratulationCloseV}
        onPress={this.onHide}>
      <Image source={require('../../../img/activity/icon_close_tiyan.png')}></Image>
    </TouchableOpacity>
    </ImageBackground>
  }

  render() {
    const data = Array.from({
      length: packetCount
    }, v => 1);
    const { countDown ,gameOver,amount} = this.state;
    return (
      <View style={styles.container}>

        {countDown <= 0 && data.map((item, idx) => {
          return <RedPacket key={idx} delay={idx}/>
        })}

        {countDown > 0 && this.renderView(countDown)}
        {gameOver && this.renderOverView(amount)}

      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1,0.5)',
    alignItems: 'center',
    justifyContent:'center'
  },
  flex1: {
    flex: 1,
  },
  couponV: {
    width: 345,
    height: 400,
    padding: 20,
    paddingBottom:0,
    alignItems: 'center'
  },
  overV: {
    width: 375,
    height: 388,
    padding: 20,
    paddingBottom:0,
    alignItems: 'center'
  },
  countDownText: {
    fontSize: 65,
    color: '#DD2C0A',
    margin:10
  },
  closeV: {
    marginTop: 37,
    marginBottom:-47
  },
  flex18: {
    flex:18
  },
  flex10: {
    flex:10
  },
  amountV: {
    width: 345,
    height: 55,
    flexDirection: 'row',
  },
  amountT: {
    fontSize: 35,
    color:'#DD2C0A'
  },
  zvc: {
    fontSize: 15,
    color: '#DD2C0A',
    paddingLeft: 4,
    paddingTop:5
  },
  congratulationT: {
    fontSize: 15,
    color: '#fff',
    marginTop:57,
  },
  congratulationCloseV: {
    marginTop: 75,
    marginBottom:-30
  }

});