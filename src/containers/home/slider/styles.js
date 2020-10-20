import React from "react-native";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";

const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const { StyleSheet } = React;

export default {
  container: {
    width: null,
    height: null,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: Colors.COLOR_BACKGROUND
  },
  slider: {
    overflow: 'visible', // for custom animations
    // marginLeft: -Constants.MARGIN_X_LARGE - 2,
  },
  sliderContentContainer: {
    padding: 0,
    // paddingVertical: Constants.MARGIN_LARGE // for custom animation
  },
  paginationContainer: {
    paddingTop: 0,
    paddingBottom: Constants.PADDING_X_LARGE
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
  }
};
