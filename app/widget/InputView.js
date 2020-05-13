import React, {Component} from "react";
import {Text, TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import {Config} from "../unit/AllUnit";

export default class Page extends Component {
  render() {
    const {
      inputProps = {},
      borderBottomWidth,
      borderTopWidth,
      renderRight,
      width = Config.width,
      leftWidth = 100,
      height = 56,
      color = "#333",
      fontSize = 15,
      marginHorizontal = 20,
      paddingHorizontal = 0,
      leftTextAlign = "right",

      onPress
    } = this.props;
    let {readonly, value} = inputProps;
    const title = this.props.children;
    if (onPress) {
      readonly = true;
    }

    const textInputViewStyle = {
      height,
      marginHorizontal,
      paddingHorizontal,
      fontSize,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderColor: "#D8D8D8"
    };
    return (
      <View
        style={[
        styles.container, {
          width,
          height
        }
      ]}>
        <View
          style={{
          ...textInputViewStyle,
          borderBottomWidth,
          borderTopWidth
        }}>
          <Text
            style={[
            styles.textInputT, {
              width: leftWidth,
              textAlign: leftTextAlign
            }
          ]}>
            {title}
          </Text>

          {readonly && (
            <Text
              numberOfLines={1}
              style={[
              styles.readonly, {
                color,
                fontSize
              }
            ]}>
              {value}
            </Text>
          )}
          {!readonly && (<TextInput
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            style={{
            flex: 1,
            height: 50,
            fontSize,
            color
          }}
            {...inputProps}/>)}
          {renderRight}
        </View>

        {onPress && (
          <TouchableOpacity
            style={{
            width: Config.width,
            height: height,
            marginTop: -height
          }}
            onPress={onPress}></TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: "#fff",
    alignItems: "center"
  },

  textInputT: {
    fontSize: 15,
    color: "#333",
    width: 100,
    marginRight: 10
  },
  input: {},
  readonly: {
    flex: 1,
    fontSize: 15,
    color: "#333"
  }
});
