import React from "react-native";
import { Dimensions } from 'react-native';
import { Constants } from 'values/constants'
import { Fonts } from 'values/fonts'
import { Colors } from 'values/colors'
import { Platform } from "react-native";

const { StyleSheet } = React;
const window = Dimensions.get('window');

export default {
    text: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
    },
    textPlaceHolder: {
        color: Colors.COLOR_DRK_GREY,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
    },
    textBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        fontWeight: 'bold'
    },
    text400: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        fontWeight: '400'
    },
    text700: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        fontWeight: '700'
    },
    textItalic: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        fontStyle: 'italic',
    },
    textBoldItalic: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        fontStyle: 'italic',
    },
    title: {
        color: Colors.COLOR_PRIMARY,
        fontSize: Fonts.FONT_SIZE_LARGE - 2,
        margin: Constants.MARGIN,
        // fontWeight: 'bold'
    },
    titleBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_LARGE,
        margin: Constants.MARGIN,
        fontWeight: 'bold'
    },
    marginLeftRight: {
        marginLeft: Constants.MARGIN_X_LARGE,
        marginRight: Constants.MARGIN_X_LARGE,
    },
    textSmall: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_XX_SMALL + 1,
    },
    textSmallBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
        fontWeight: 'bold'
    },
    textSmallItalic: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
        fontStyle: 'italic'
    },
    textSmallItalicPrimary: {
        color: Colors.COLOR_TEXT_PRIMARY,
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
        fontStyle: 'italic'
    },
    fabBigSize: {
        width: Constants.BIG_CIRCLE,
        height: Constants.BIG_CIRCLE,
        borderRadius: Constants.BIG_CIRCLE,
        backgroundColor: Colors.COLOR_PRIMARY,
        margin: 0,
    },
    viewHorizontal: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textOrange: {
        color: Colors.COLOR_PRIMARY,
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        margin: Constants.MARGIN,
    },
    textOrangeBold: {
        color: Colors.COLOR_PRIMARY,
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        margin: Constants.MARGIN,
        fontWeight: 'bold'
    },
    buttonStyle: {
        borderRadius: Constants.CORNER_RADIUS,
        margin: Constants.MARGIN_X_LARGE,
        padding: Constants.PADDING
    },
    buttonImage: {
        marginBottom: Constants.MARGIN_X_LARGE,
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: Constants.CORNER_RADIUS,
    },
    inputText: {
        paddingVertical: Constants.PADDING_LARGE,
        paddingHorizontal: Constants.MARGIN_X_LARGE
    },
    pickerStyle: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: '10%',
    },
    shadowOffset: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT
    },
    viewCenter: {
        justifyContent: "center",
        alignItems: "center",
    },
    viewSpaceBetween: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    touchInputSpecial: {
        flex: 1,
        flexDirection: 'row',
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT,
        borderRadius: Constants.CORNER_RADIUS,
    },
    marginForShadow: {
        marginTop: Constants.MARGIN,
        marginBottom: Constants.MARGIN_LARGE + Constants.MARGIN,
        marginHorizontal: Constants.MARGIN_X_LARGE
    },
    header: {
        backgroundColor: Colors.COLOR_WHITE,
        borderBottomWidth: 0,
        alignItems: 'center'
    },
    cardView: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT,
        backgroundColor: Colors.COLOR_WHITE,
        paddingHorizontal: Constants.PADDING_LARGE,
        paddingVertical: Constants.PADDING_LARGE,
        borderRadius: Constants.CORNER_RADIUS * 3,
        marginVertical: Constants.MARGIN_LARGE,
        // borderWidth: 1,

    },
    tabStyle: {
        backgroundColor: Colors.COLOR_BACKGROUND
    },
    activeTabStyle: {
        backgroundColor: Colors.COLOR_WHITE,
    },
    activeTextStyle: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        margin: Constants.MARGIN,
        fontWeight: 'bold',
        color: Colors.COLOR_BLACK
    },
    textStyle: {
        flex: 1,
        textAlign: "center",
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        borderColor: Colors.COLOR_BACKGROUND,
        borderLeftWidth: Constants.BORDER_WIDTH / 2,
        borderRightWidth: Constants.BORDER_WIDTH / 2,

    },
    tabBarUnderlineStyle: {
        backgroundColor: Colors.COLOR_PRIMARY,
        height: Constants.BORDER_WIDTH
    },
    scrollableTab: {
        borderWidth: 0,
        backgroundColor: Colors.COLOR_WHITE
    },
    border: {
        borderWidth: Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_BORDER
    },
    circleBg: {
        width: Constants.MAX_WIDTH * 1.6,
        height: Constants.MAX_WIDTH * 1.6,
        position: 'absolute',
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.MAX_WIDTH * 0.8,
        left: - Constants.MAX_WIDTH * 0.6,
        top: -Constants.MAX_WIDTH * 0.2
    },
    titleInputForm: {
        fontWeight: 'bold',
        marginLeft: Constants.MARGIN_X_LARGE,
        fontSize: Fonts.FONT_SIZE_XX_LARGE,
        color: Colors.COLOR_TEXT_PRIMARY,
    },
    textWarnSmall: {
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
        color: Colors.COLOR_BUTTON_LOGIN_GG,
    }
};