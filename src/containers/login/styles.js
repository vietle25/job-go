import React from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import commonStyles from "styles/commonStyles";

const { StyleSheet } = React;

export default {
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: Colors.COLOR_WHITE
    },
    contentContainer: { flexGrow: 1 },
    imageBackground: {
        resizeMode: 'contain',
        // opacity: 0.5,
        flex: 1,
        // justifyContent: "center",
        justifyContent: "space-between",
    },
    containerTitleLogin: {
        flex: 1, justifyContent: 'center'
    },
    textTitle: {
        // margin: 0,
        fontSize: Fonts.FONT_SIZE_LARGE,
        // marginHorizontal: Constants.MARGIN_X_LARGE,
        // marginBottom: Constants.MARGIN_XX_LARGE,
        paddingTop: Constants.MARGIN_LARGE,
        color: '#79C002'
    },
    textPhone: {
        margin: 0,
        marginLeft: Constants.MARGIN_X_LARGE,
        color: 'white'
    },
    inputGroup: {
        borderRadius: Constants.CORNER_RADIUS,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        borderColor: '#79C002',
        borderWidth: 0.4
    },
    inputNormal: {
        margin: 0, padding: Constants.PADDING_LARGE
    },
    buttonLogin: {
        textColor: Colors.COLOR_WHITE,
        backgroundColor: Colors.COLOR_GREEN_LIGHT,
    },
    textOr: {
        color: Colors.COLOR_BLACK
    },
    containerTextOr: {
        alignItems: 'center',
        marginTop: Constants.MARGIN_X_LARGE
    },
    containerIcons: {
        justifyContent: 'center', marginTop: Constants.MARGIN_LARGE * 2
    },
    touchableOpacityFacebookIcon: {
        flexDirection: 'row',
        alignItems: 'center', marginRight: 20

    },
    touchableOpacityGoogleIcon: {
        flexDirection: 'row',
        alignItems: 'center'

    },

    touchableOpacityRegister: {
        flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'
    },
    textRegister: {
        marginLeft: -6, paddingLeft: Constants.PADDING_LARGE,
        paddingVertical: Constants.PADDING_X_LARGE,
        color: Colors.COLOR_TEXT
    },
    textForgotPassword: {
        margin: 0, paddingLeft: Constants.PADDING_LARGE,
        paddingVertical: Constants.PADDING_X_LARGE,
        color: Colors.COLOR_WHITE,
        textDecorationLine: 'underline'
    },
    containerRegister_1: {
        justifyContent: 'flex-end',
        marginBottom: Constants.MARGIN_X_LARGE,
        alignItems: 'center'
    },
    containerRegister_2: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Colors.COLOR_ERA
    },
    buttonLogin: {
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: Constants.CORNER_RADIUS * 2,
        padding: Constants.MARGIN_LARGE + 2,
        alignItems: 'center',
        marginHorizontal: Constants.MARGIN_X_LARGE,
        marginTop: Constants.MARGIN_X_LARGE
    },
    inputLogin: {
        marginLeft: Constants.MARGIN_LOGIN,
        marginRight: Constants.MARGIN_LOGIN,
        marginBottom: Constants.MARGIN_LARGE
    },
    staticComponent: {
        marginBottom: Constants.MARGIN_X_LARGE * 2,
    },
    images: {
        marginLeft: 8, marginRight: 8, marginTop: 8, marginBottom: 2,
        alignItems: 'flex-end',
        justifyContent: 'flex-end', alignSelf: 'flex-end'
    },
    textForgotPass: {
        fontSize: Fonts.FONT_SIZE_XX_SMALL, textAlign: 'right',
        padding: Constants.PADDING,
        margin: 0
    },
    buttonSocial: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: Constants.MARGIN_XX_LARGE
    }
};
