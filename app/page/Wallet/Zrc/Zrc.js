import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { NavBar, TopPadding, EmptyComponent, TopSearch, KeyboardAwareScrollView } from '../../../widget/AllWidget'
import {
  Config,
  fullUrlRequest,
  i18n,
  NavigationService,
  UMAnalyticsModule,
  chainRequest
} from '../../../unit/AllUnit';
import HomeHeader from '../view/HomeHeader';
import ZrcAction from '../../../redux/actions/ZrcAction';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import ZrcCell from '../view/ZrcCell';
import { NavigationEvents } from 'react-navigation';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      isEdit: false,
      searchData: []
    };
  }

  onDidFocus = () => {
    this
      .props
      .updateAllValue();
    this.timerout = setTimeout(this.onDidFocus, 1000 * 20);
  }

  onDidBlur = () => {
    clearTimeout(this.timerout);
  }

  onSearchTextChange = (name) => {
    if (!this.state.isSearch) {
      this.setState({ isSearch: true, isEdit: false });
    }
    if (!name) {
      return;
    }

    fullUrlRequest(Config.PLEDGE_HOST + '/token/findByName', {
      name
    }, 'GET').then(data => {
      this.setState({ searchData: data })
    })

  }

  onSearchCancel = () => {
    this.setState({ isSearch: false });
  }

  onEditPress = () => {
    if (this.state.isSearch) {
      return;
    }
    this.setState({
      isEdit: !this.state.isEdit
    });
  }

  onZrcPress = index => {
    const { isSearch, isEdit } = this.state;
    if (isSearch || isEdit) {
      return;
    }
    this
      .props
      .updateZrc({ selectedIndex: index })
    NavigationService.navigate('ZrcDetail')

  }

  onDelete = index => {
    this
      .props
      .deleteZrc(index);
  }
  onAdd = index => {
    this
      .props
      .addZrc(index)
  }

  onToTop = index => {
    this
      .props
      .toTopZrc(index)
  }

  render() {

    let { zrcList } = this.props.zrc;

    const { isSearch, isEdit, searchData } = this.state;
    if (isSearch) {
      zrcList = searchData;
    }

    return (
      <View style={styles.container}>
        <NavBar
          title={i18n.zrc_title}
          right={[{
            title: isEdit
              ? 'unlock'
              : 'lock',
            onPress: this.onEditPress
          }
          ]} />
        <NavigationEvents onDidFocus={this.onDidFocus} onDidBlur={this.onDidBlur}></NavigationEvents>

        <TopSearch
          placeholder={i18n.zrc_searchPlaceholder}
          onChangeText={this.onSearchTextChange}
          onCancel={this.onSearchCancel}></TopSearch>
        {!isSearch && <View>
          <View style={styles.row}>
            <Image source={require('../../../img/zrc/icon_warning.png')}></Image>
            <Text style={styles.warning}>{i18n.zrc_warning}</Text>
          </View>
          <HomeHeader title={i18n.zrc_myZrc}></HomeHeader>
        </View>}
        <KeyboardAwareScrollView>

          <FlatList
            data={zrcList}
            extraData={`${isSearch}${isEdit}${this.props.zrc.zrcList.length}`}
            keyExtractor={(item, k) => k + 'zrc'}
            renderItem={({ item, index }) => <TouchableOpacity onPress={() => this.onZrcPress(index)}>
              <ZrcCell
                isEdit={isEdit}
                isSearch={isSearch}
                item={item}
                onDelete={() => this.onDelete(index)}
                onAdd={() => this.onAdd(item)}
                onToTop={() => this.onToTop(item)} />
            </TouchableOpacity>}
            ListFooterComponent={< EmptyComponent img='no_list' hide={
              zrcList.length > 0
            } />} />

        </KeyboardAwareScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  warning: {
    width: Config.width - 60,
    fontSize: 13,
    color: '#666',
    paddingLeft: 10,
    lineHeight: 18.5
  }
});
export default connect(state => ({ zrc: state.zrc }), dispatch => ({
  addZrc: bindActionCreators(ZrcAction.addZrc, dispatch),
  updateZrc: bindActionCreators(ZrcAction.updateZrc, dispatch),
  deleteZrc: bindActionCreators(ZrcAction.deleteZrc, dispatch),
  updateAllValue: bindActionCreators(ZrcAction.updateAllValue, dispatch),
  toTopZrc: bindActionCreators(ZrcAction.toTopZrc, dispatch)
}))(Page)
