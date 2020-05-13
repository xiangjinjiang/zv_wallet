import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import React, {Component} from 'react';

export default render = (props) => {
  const {height} = props
  return <KeyboardAwareScrollView
    contentContainerStyle={{
    alignItems: 'center',
    height
  }}
    extraHeight={10}
    enableOnAndroid={true}
    alwaysBounceVertical={false}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}>
    {props.children}
  </KeyboardAwareScrollView>
}