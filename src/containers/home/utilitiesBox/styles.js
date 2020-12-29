import React from "react-native";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";

const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const screen = Dimensions.get('window');
const widthItem = (screen.width - 4 * Constants.MARGIN_XX_LARGE) / 5.5
const { StyleSheet } = React;

export default {
    itemBox: {
        ...commonStyles.shadowOffset,
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Colors.COLOR_RED,
        padding: Constants.PADDING_X_LARGE,
        borderRadius: Constants.BORDER_RADIUS,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        width: widthItem,
        height: widthItem
    },
    imageItem: {
        flex: 1,
        backgroundColor: Colors.COLOR_GOOGLE, alignItems: "center",
        borderRadius: Constants.BORDER_RADIUS,
        padding: Constants.PADDING_X_LARGE
    },
    titleBox: {
        ...commonStyles.text,
        flex: 1,
        textAlign: "center",
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
        margin: 0,
        marginTop: Constants.MARGIN_LARGE
    }
};
