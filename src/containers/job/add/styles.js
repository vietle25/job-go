import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from 'values/constants'
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";

const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get('window').width;
const { StyleSheet } = React;
const SIZE_ICON = 24;

export default styles = {
    container: {
        // width: null,
        // height: null,
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'stretch',
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
    },
    boxTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        ...commonStyles.text
    },
    checkBox: {
        ...commonStyles.viewCenter,
        width: 18,
        height: 18,
        borderWidth: 2,
        borderRadius: 9,
        borderColor: Colors.COLOR_PRIMARY,
        marginRight: Constants.MARGIN_X_LARGE
    },
    viewBackground: {
        width: Constants.MAX_WIDTH * 1.6,
        height: Constants.MAX_WIDTH * 1.6,
        position: 'absolute',
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.MAX_WIDTH * 0.8,
        left: - Constants.MAX_WIDTH * 0.6,
        top: -Constants.MAX_WIDTH * 0.2
    },
    title: {
        ...commonStyles.textBold,
        marginLeft: Constants.MARGIN_X_LARGE,
        fontSize: Fonts.FONT_SIZE_XX_LARGE,
        color: Colors.COLOR_TEXT_PRIMARY,
    },
    buttonContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end', flex: 1,
        marginHorizontal: Constants.MARGIN_XX_LARGE,
        marginVertical: Constants.MARGIN_X_LARGE,
        flexDirection: 'row'
    },
    buttonPrev: {
        padding: Constants.PADDING_LARGE,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        backgroundColor: Colors.COLOR_BLUE_SEA,
        borderRadius: Constants.CORNER_RADIUS
    },
    buttonNext: {
        padding: Constants.PADDING_LARGE,
        borderRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_ERA,
    },
    titleInput: {
        ...commonStyles.text700,
        marginLeft: Constants.MARGIN,
        marginTop: Constants.MARGIN_X_LARGE,
        fontSize: Fonts.FONT_SIZE_X_LARGE,
        marginBottom: Constants.MARGIN_X_LARGE
    },
    containerEditJob: {
        flexGrow: 1,
        paddingBottom: Constants.PADDING_X_LARGE,
        marginHorizontal: Constants.MARGIN_LARGE
    },
    titleInputAddJob: {
        ...commonStyles.textBold,
        marginLeft: Constants.MARGIN_LARGE,
        marginTop: Constants.MARGIN_X_LARGE,
        marginBottom: - Constants.MARGIN_LARGE
    }
}