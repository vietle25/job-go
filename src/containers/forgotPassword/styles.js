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
        backgroundColor: Colors.COLOR_WHITE,
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
    inputGroup: {
        borderRadius: Constants.CORNER_RADIUS,
        borderColor: '#79C002',
        borderWidth: 0.4
    },
    inputNormal: {
        margin: 0,
        color: Colors.COLOR_WHITE
    },
    textWarn: {
        ...commonStyles.textWarnSmall,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        marginBottom: Constants.MARGIN_LARGE
    }
};
