import React from "react-native";
import {Colors} from "values/colors";
import {Constants} from 'values/constants'
import commonStyles from "styles/commonStyles";
import {Fonts} from "values/fonts";

const {Dimensions, Platform} = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get('window').width;
const {StyleSheet} = React;
const SIZE_ICON = 24;

export default styles = {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_WHITE
    },
    textMenu: {
        ...commonStyles.textBold,
        flex: 1,
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
    },
    iconMenu: {
        margin: Constants.MARGIN,
        backgroundColor: Colors.COLOR_RED,
        width: SIZE_ICON,
        height: SIZE_ICON,
        borderRadius: SIZE_ICON / 2
    },
    checkBox: {
        backgroundColor: Colors.COLOR_WHITE,
        borderWidth: 0,
        padding: 0
    },
    floatingButton: {
        position: 'absolute',
        right: Constants.MARGIN_X_LARGE,
        bottom: Constants.MARGIN_X_LARGE,
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: Constants.BORDER_RADIUS,
        padding: Constants.PADDING_X_LARGE
    }
}