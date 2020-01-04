import React from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts'
import commonStyles from "styles/commonStyles";

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

    buttonForgotPassword: {
        marginLeft: Constants.MARGIN_LOGIN,
        marginRight: Constants.MARGIN_LOGIN,
        marginBottom: Constants.MARGIN_LARGE,
    },
    inputForgotPassword: {
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'bottom',
        padding: Constants.PADDING,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
    },
    buttonLogin: {
        marginBottom: 10,
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: 40,

    },
    staticComponent: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    styleInput: {
        // ...commonStyles.shadowOffset,
        borderColor: Colors.COLOR_GREY_LIGHT,
        borderWidth: 1,
        width: 48,
        height: 48,
        borderRadius: 2,
        textAlign: 'center',
        paddingHorizontal: 0,
        marginHorizontal: Constants.MARGIN_LARGE
    },
    shadowOffset: {
        elevation: Constants.SHADOW,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY,
    },
    inputOTP: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.COLOR_WHITE,
        width: Constants.MAX_WIDTH * 0.4,
        color: Colors.COLOR_WHITE,
        fontSize: Fonts.FONT_SIZE_XX_LARGE,
        textAlign: 'center', letterSpacing: 15
    },
    textCountDown: {
        ...commonStyles.text,
        color: Colors.COLOR_WHITE, textAlign: 'center',
        marginTop: Constants.MARGIN_X_LARGE
    }
};
