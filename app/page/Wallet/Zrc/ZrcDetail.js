import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Clipboard
} from 'react-native';
import {
  NavBar,
  ScrollTab,
  EmptyComponent,
  Button,
  BoldText,
  TopPadding
} from '../../../widget/AllWidget'
import {
  Config,
  i18n,
  ShowText,
  Toast,
  NavigationService,
  fullUrlRequest,
  TxManager
} from '../../../unit/AllUnit';
import ZrcAction from '../../../redux/actions/ZrcAction';
import WalletAction from '../../../redux/actions/WalletAction';
import WalletTxCell from '../view/WalletTxCell';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {NavigationEvents} from 'react-navigation';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        [], [], []
      ],
      refreshing: false
    };
    this.pageList = [1, 1, 1];
    this.pageSize = 10;
    this.loadMoreList = [false, false, false];
    this.tabTypes = [10, 11, 12];
    this.tabIndex = 0;
  }

  onDidFocus = () => {
    this.getData();
  }

  componentWillMount() {
    this.timerout = setInterval(this.getData, 1000 * 20);
  }

  componentWillUnmount() {
    clearInterval(this.timerout);
  }

  getData = () => {
    console.warn(this.tabIndex);

    this.setState({data: [
        [], [], []
      ]})
    this.onRefresh(this.tabIndex);
  }

  onRefresh = tabIndex => {
    this.pageList[tabIndex] = 1;
    this.setState({refreshing: true})
    this.getData(tabIndex)
  }

  onEndReached = tabIndex => {
    if (!this.loadMoreList[tabIndex]) 
      return
    this.pageList[tabIndex] += 1
    this.getData(tabIndex)
  }

  getData = (tabIndex = 0) => {
    this
      .props
      .updateValue();

    const {address} = WalletAction.selectedAccount();
    const contractAddress = ZrcAction
      .selectedZrc()
      .address;
    let pageNum = this.pageList[tabIndex];
    const type = this.tabTypes[tabIndex];
    fullUrlRequest(Config.PLEDGE_HOST + '/token/transactionList', {
      contractAddress,
      address,
      p: pageNum,
      pageSize: this.pageSize,
      type
    }, 'GET').then(data => {

      let trans = data;
      let stateData = this.state.data;
      this.loadMoreList[tabIndex] = trans.length >= this.pageSize

      if (pageNum > 1) {
        stateData[tabIndex] = stateData[tabIndex].concat(trans)
      } else {
        const paddingTxList = TxManager.getPaddingTxList(trans, type, address, () => {
          this.onRefresh(tabIndex)
        }, contractAddress);
        if (paddingTxList.length) {
          trans = paddingTxList.concat(trans)
        } else {}
        stateData[tabIndex] = trans;
      }
      this.setState({refreshing: false, data: stateData})
      return;
    }).catch(err => {
      console.log(err)
      this.setState({refreshing: false})
    })
  }
  render() {
    const {name, address, value, decimal} = ZrcAction.selectedZrc();
    const titles = [i18n.send_All, i18n.friend_in, i18n.friend_out];
    const userAdderss = WalletAction
      .selectedAccount()
      .address;

    return (
      <View style={styles.container}>
        <NavBar title={name} right={[{title:'teken_detail',onPress:()=>NavigationService.navigate('ZrcTokenDetail')}]}></NavBar>
        <NavigationEvents onDidFocus={this.onDidFocus}></NavigationEvents>
        <TopPadding></TopPadding>

        <Image
          source={require('../../../img/zrc/img_jifenbg.png')}
          style={styles.topBg}/>
        <View style={styles.topView}>
          <View style={styles.valueV}>
            <BoldText style={styles.value}>{ShowText.showZV(value, decimal)}
              <Text style={styles.name}>{' '}{name}</Text>
            </BoldText>
            <Text style={styles.balance}>{i18n.fortune_huoqi}</Text>
          </View>
        </View>
        <TopPadding></TopPadding>

        <ScrollTab
          titles={titles}
          onTabChanged={index => {
          this.tabIndex = index;
          if (!this.state.data[index].length) {
            this.onRefresh(index)
          }
        }}>
          {titles.map((_itemTitle, tabIndex) => {
            return <FlatList
              key={tabIndex}
              refreshing={this.state.refreshing}
              showsVerticalScrollIndicator={false}
              onRefresh={() => this.onRefresh(tabIndex)}
              onEndReached={() => this.onEndReached(tabIndex)}
              keyExtractor={(item, k) => k + 'zrctx'}
              data={this.state.data[tabIndex]}
              style={styles.flatListBox}
              renderItem={({item, index}) => <WalletTxCell
              item={item}
              decimal={decimal}
              coinName={name}
              userAdderss={userAdderss}/>}
              ListFooterComponent={< EmptyComponent minHeight = {
              350
            }
            img = 'no_list' paddingTop = {
              10
            }
            hide = {
              this.state.data[tabIndex].length > 0 || this.state.refreshing
            } />}/>
          })}
        </ScrollTab>

        <View style={styles.buttonV}>

          <Button
            style={styles.leftButton}
            onPress={() => NavigationService.navigate('ZrcTransfer')}>{i18n.friend_out}</Button>
          <Button
            style={styles.rightButton}
            onPress={() => NavigationService.navigate('WalletReceive', {coinName: name})}>{i18n.friend_in}</Button>
        </View>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  topBg: {
    width: Config.width - 30,
    margin: 10,
    height: 90,
    resizeMode: 'stretch',
    borderRadius:4
  },
  topView: {
    width: Config.width - 30,
    height: 110,
    marginTop: -110,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  valueV: {},
  value: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center'
  },
  balance: {
    fontSize: 13,
    color: '#fff',
    marginTop: 8
  },

  name: {
    fontSize: 22
  },

  flatListBox: {
    width: Config.width,
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 250
  },
  buttonV: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  leftButton: {
    width: (Config.width - 45) / 2,
    marginLeft: 15,
    marginRight: 0
  },
  rightButton: {
    width: (Config.width - 45) / 2,
    marginLeft: 15,
    marginRight: 0,
    backgroundColor: '#fff',
    color: Config.appColor,
    borderWidth: 1,
    borderColor: Config.appColor
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  updateValue: bindActionCreators(ZrcAction.updateValue, dispatch)
}))(Page)