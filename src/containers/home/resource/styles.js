import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from 'values/constants'
import commonStyles from "styles/commonStyles";
const { Dimensions, Platform, StyleSheet } = React;

const window = Dimensions.get("window");

export default styles = {
    containerItem: {
        padding: Constants.PADDING_LARGE - 2,
        borderWidth: Constants.BORDER_WIDTH,
        borderRadius: Constants.CORNER_RADIUS
    },
    resource: {
        width: window.width / 6,
        height: window.width / 6,
        borderRadius: Constants.CORNER_RADIUS
    },
    playVideo: {
        ...commonStyles.viewCenter,
        backgroundColor: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE,
        position: "absolute",
        top: 0, right: 0, left: 0, bottom: 0
    },
    btnDelete: {
        ...commonStyles.viewCenter,
        position: "absolute",
        top: 0, right: 0,
        backgroundColor: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE,
        padding: Constants.PADDING_LARGE,
        margin: Constants.MARGIN,
        borderRadius: Constants.CORNER_RADIUS
    },
    btnDeleteThumb: {
        ...commonStyles.viewCenter,
        width: 16,
        height: 16,
        position: "absolute",
        top: -1, right: -1,
        backgroundColor: Colors.COLOR_BLACK_OPACITY_50,
        borderRadius: 8
    },
    warning: {
        ...commonStyles.viewCenter,
        position: "absolute",
        backgroundColor: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE,
        borderWidth:Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_RED,
        top: 0, right: 0, left: 0, bottom: 0
    }
}