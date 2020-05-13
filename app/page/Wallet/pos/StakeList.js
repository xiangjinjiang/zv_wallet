/*

type:
1 = 所有
2 = 转入
3 = 转出
4 = 质押
5 = 质押借出
*/

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  FlatList
} from 'react-native';
import {NavBar, TopPadding, EmptyComponent, ScrollTab} from '../../../widget/AllWidget'
import {Config, fullUrlRequest, i18n, TxManager} from '../../../unit/AllUnit';
import WalletTxCell from '../view/WalletTxCell';
import WalletAction from '../../../redux/actions/WalletAction';

export default class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        [], [], []
      ],
      refreshing: true
    };
    this.pageList = [1, 1];
    this.pageSize = 10;
    this.loadMoreList = [false, false, false];

    if (this.props.navigation.state.params && this.props.navigation.state.params.type == 5) {
      this.tabTitles = [i18n.skate_listTabSkateOut, i18n.skate_listTabSkate];
      this.tabTypes = [5, 4];
    } else {
      this.tabTitles = [i18n.skate_listTabSkate, i18n.skate_listTabSkateOut];
      this.tabTypes = [4, 5];
    }
  }

  componentDidMount() {
    this.onRefresh(0);
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

  getData = (tabIndex) => {
    const {address} = WalletAction.selectedAccount();
    let pageNum = this.pageList[tabIndex];
    const type = this.tabTypes[tabIndex];

    fullUrlRequest(Config.PLEDGE_HOST + '/queryTransactionList', {
      address: address,
      p: pageNum,
      pageSize: this.pageSize,
      type
    }, 'GET').then(data => {
      console.warn(data);

      let trans = data;
      let stateData = this.state.data;
      this.loadMoreList[tabIndex] = trans.length >= this.pageSize

      if (pageNum > 1) {
        stateData[tabIndex] = stateData[tabIndex].concat(trans)
      } else {
        const paddingTxList = TxManager.getPaddingTxList(trans, type, address, () => {
          this.onRefresh(tabIndex)
        });
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

    const {address} = WalletAction.selectedAccount();

    return (
      <View style={styles.container}>
        <NavBar title={i18n.skate_list}/>
        <TopPadding></TopPadding>
        <ScrollTab
          ref={tabRef => this.tabRef = tabRef}
          titles={this.tabTitles}
          onTabChanged={index => {
          this.tabIndex = index;
          if (!this.state.data[index].length) {
            this.onRefresh(index)
          }
        }}>
          {this
            .tabTitles
            .map((_itemTitle, tabIndex) => {
              return <FlatList
                key={tabIndex}
                refreshing={this.state.refreshing}
                showsVerticalScrollIndicator={false}
                style={styles.FlatListBox}
                onRefresh={() => this.onRefresh(tabIndex)}
                onEndReached={() => this.onEndReached(tabIndex)}
                keyExtractor={(item, k) => k + 'wallet1'}
                data={this.state.data[tabIndex]}
                renderItem={({item, index}) => <WalletTxCell item={item} userAdderss={address}/>}
                ListFooterComponent={< EmptyComponent img = 'no_list' hide = {
                this.state.data[tabIndex].length > 0 || this.state.refreshing
              } />}/>
            })}
        </ScrollTab>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.bgColor
  },
  FlatListBox: {
    width: Config.width,
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 50
  }
});