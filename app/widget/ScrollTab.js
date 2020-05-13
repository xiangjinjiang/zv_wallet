import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {Config, CoinConfig} from '../unit/AllUnit';
import {withNavigation} from 'react-navigation';

class Page extends Component {

  state = {
    selectIndex: 0,
    lineLeft: new Animated.Value(15),
    lineWidth: new Animated.Value(40),
    ScrollTabHeight: 1000
  }
  textWithList = []; //记录不同tab文字的宽度
  lastOffsetY = 0

  componentWillMount() {}
  componentDidMount() {
    setTimeout(() => this.animateTo(0), 200)
    const parent = this
      .props
      .navigation
      .dangerouslyGetParent()
    this.isTab = parent && parent.state && (parent.state.routeName === 'Tab' || parent.state.routeName === 'WalletTab');

  }

  _onLayout(event, key) {
    let {width} = event.nativeEvent.layout;
    this.textWithList[key] = width;
  }

  onTabPress = selectIndex => {
    if (selectIndex == this.state.selectIndex || selectIndex < 0 || selectIndex >= this.props.titles.length) {
      return;
    }

    this.animateTo(selectIndex)
    const x = selectIndex * Config.width;
    if (this.scrollView) {
      this
        .scrollView
        .scrollTo({x, animated: true})
    }
    selectIndex = parseFloat(selectIndex).toFixed();
    this.setState({selectIndex})

    this.props.onTabChanged && this
      .props
      .onTabChanged(selectIndex);
  }

  lineLeftWithIndex = index => {
    index = parseFloat(index).toFixed();
    const textPadding = 30; //tab标题文本之间的固定值
    let lineLeft = 15;
    for (let i = 0; i < index; i++) {
      lineLeft += this.textWithList[i] + textPadding
    }
    return lineLeft;
  }
  lineWidthWithIndex = index => {
    index = parseFloat(index).toFixed();
    if (index < 0) 
      index = 0;
    if (index >= this.textWithList.length) 
      index = this.textWithList.length - 1;
    if (this.textWithList.length == 0) 
      return 0;
    
    return this.textWithList[index];
  }

  animateTo = index => {
    this.interval = setTimeout(() => {
      let lineWidth = this.lineWidthWithIndex(index);
      let lineLeft = this.lineLeftWithIndex(index);
      this.animateLeftAndWidth(lineLeft, lineWidth)
    }, 50);

  }

  animateLeftAndWidth = (left, width) => {
    const duration = 1;

    if (left > 0 && width > 0) {
      Animated
        .timing(this.state.lineWidth, {
        toValue: width,
        duration
      })
        .start()
      Animated
        .timing(this.state.lineLeft, {
        toValue: left,
        duration
      })
        .start();
    }
  }

  // 跟随滚动设置线条的位置和宽度
  followAnmate = x => {

    const index = this.state.selectIndex;
    let lineLeft = this.lineLeftWithIndex(index);
    let lineWidth = this.lineWidthWithIndex(index);

    const targetIndex = x - Config.width * index > 0
      ? index + 1
      : index - 1
    const targetWidth = this.lineWidthWithIndex(targetIndex) * 16 / 14;

    let offset = (x - Config.width * index) / Config.width;
    if (offset > 0) {
      if (offset > 1) 
        offset = 1;
      lineLeft += (x - Config.width * index) / Config.width * (lineWidth * 14 / 17 + 30);
    } else {
      if (offset < -1) 
        offset = -1;
      lineLeft += (x - Config.width * index) / Config.width * (targetWidth * 14 / 17 + 30);
    }

    const toValue = lineWidth + (targetWidth - lineWidth) * Math.abs(x - Config.width * index) / Config.width;
    this.animateLeftAndWidth(lineLeft, toValue)
  }

  onMomentumScrollEnd = (event) => {
    let index = event.nativeEvent.contentOffset.x / Config.width;
    this.onTabPress(index)
  };

  onTabLayout = event => {
    let {y} = event.nativeEvent.layout;
    let ScrollTabHeight = Config.height - y - 40;
    if (this.isTab) {
      ScrollTabHeight -= Config.statusBarHeight + 29
    }
    if (!Config.isIos) {
      ScrollTabHeight += 80;
    }
    this.setState({ScrollTabHeight})
  }

  render() {
    let {
      children,
      titles,
      type,
      lineColor = '#333',
      SelectTColor = '#333',
      normalTColor = '#666',
      backgroundColor = '#fff',
      borderBottomWidth = 1
    } = this.props;

    if (type == 'home') {
      lineColor = '#fff',
      SelectTColor = '#fff',
      normalTColor = '#fff',
      backgroundColor = Config.appColor
    }

    const {selectIndex, lineWidth, lineLeft, ScrollTabHeight} = this.state;

    return <View onLayout={this.onTabLayout}>
      <View style={[styles.tab, {
          backgroundColor
        }]}>
        <View style={[styles.row, {
            borderBottomWidth
          }]}>
          {titles.map((item, key) => {
            return <TouchableOpacity
              style={styles.selectV}
              onPress={() => this.onTabPress(key)}
              key={key}>
              <Text
                onLayout={event => this._onLayout(event, key)}
                style={selectIndex == key
                ? [
                  styles.selectedT, {
                    color: SelectTColor
                  }
                ]
                : [
                  styles.normalT, {
                    color: normalTColor
                  }
                ]}>{item}</Text>
            </TouchableOpacity>
          })}
        </View>

        <Animated.View
          style={{
          backgroundColor: lineColor,
          height: 2,
          borderRadius: 1,
          width: lineWidth,
          marginLeft: lineLeft,
          marginTop: -2
        }}>
          <View/>
        </Animated.View>

      </View>
      <ScrollView
        pagingEnabled
        horizontal
        style={{
        height: ScrollTabHeight
      }}
        onScroll={(event) => {
        let x = event.nativeEvent.contentOffset.x;
        this.followAnmate(x);
      }}
        scrollEventThrottle={3}
        ref={ref => this.scrollView = ref}
        showsHorizontalScrollIndicator={false}
        iosbounces={false}
        iosalwaysBounceHorizontal={false}
        iosalwaysBounceHorizontal={false}
        onMomentumScrollEnd={this.onMomentumScrollEnd}>
        {children}
      </ScrollView>
    </View>
  }
}

const styles = StyleSheet.create({
  tab: {
    width: Config.width,
    height: 44,
    backgroundColor: Config.appColor
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    borderColor: Config.lineColor,
    borderBottomWidth: 1
  },
  selectV: {
    marginRight: 30,
    marginBottom: 0
  },
  selectedT: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600'
  },
  normalV: {
    padding: 15
  },
  normalT: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'normal'
  }
});

export default withNavigation(Page)
