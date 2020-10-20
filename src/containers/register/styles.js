import React from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts'
import commonStyles from 'styles/commonStyles';

const { StyleSheet } = React;
const HEIGHT_INPUT = 30
export default {
    textSmall: {
        // fontFamily: Fonts.FONT_NORMAL,
        marginLeft: Constants.MARGIN,
        marginRight: Constants.MARGIN,
        marginBottom: Constants.MARGIN,
        marginTop: Constants.MARGIN,
    },
    text: {
        color: Colors.COLOR_TEXT,
        // fontFamily: Fonts.FONT_NORMAL,
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        marginBottom: Constants.MARGIN,
        marginTop: Constants.MARGIN,
    },
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_WHITE
    },
    staticComponent: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    input: {
        ...commonStyles.text,
        height: '100%',
        padding: Constants.PADDING,
        fontSize: Fonts.FONT_SIZE_X_MEDIUM,
        textAlignVertical: 'bottom',
        margin: 0,
        height: HEIGHT_INPUT,
    },
    checkText: {
        //  color: Colors.COLOR_TEXT,
        // fontFamily: Fonts.FONT_NORMAL,
        fontSize: Fonts.FONT_SIZE_MEDIUM,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        //flex: 0,
    },

    images: {
        marginRight: 8, marginBottom: 2, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'flex-end',
        // backgroundColor:'black'
    },

    checkboxGender: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        flex: 1,
        borderWidth: 0,
        margin: 0,
        marginRight: 0,
        padding: 0,
    },

    modalDropdown: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: Colors.COLOR_GREY,
        paddingLeft: Constants.PADDING_X_LARGE,
        paddingRight: 30,
        paddingVertical: Constants.PADDING
    },

    itemInputStyle: {
        marginBottom: 25,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
    },

    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    checkBox: {
        marginLeft: - Constants.MARGIN_LARGE,
        marginRight: Constants.MARGIN_X_LARGE
    },


    scrollViewContentContainer: {
        flexGrow: 1,
        paddingHorizontal: Constants.PADDING_X_LARGE,
    },
    scrollView: {
        flex: 1,
    },
    imageBackground: {
        resizeMode: 'contain',
        flex: 1,
        justifyContent: 'space-between',
    },
    textRegister: {
        margin: 0,
        // marginBottom : -20,
        // paddingBottom : -50,
        fontSize: Fonts.FONT_SIZE_XX_LARGE + Fonts.FONT_SIZE_XX_MEDIUM,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        color: Colors.COLOR_WHITE,
        marginBottom: Constants.MARGIN_XX_LARGE,
    },
    inputGroup: {
        marginVertical: Constants.MARGIN_LARGE
    },
    inputNormal: {
        margin: 0,
    },
    buttonRegister: {
        textColor: Colors.COLOR_WHITE,
        backgroundColor: Colors.COLOR_GREEN_LIGHT
    },
    textAlreadyAcc: {
        ...commonStyles.text,
        color: Colors.COLOR_BLACK
    },
    viewFormRegister: {
        flex: 1, justifyContent: 'center'
    },
    formRegister: {
        alignitems: 'center', marginTop: 0
    },
    viewPassword: {
        justifyContent: 'center', position: 'relative'
    },
    viewConfirmPassword: {
        justifyContent: 'center', position: 'relative'
    },
    viewNotHaveAccount_1: {
        justifyContent: 'flex-end'
    },
    viewNotHaveAccount_2: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -Constants.MARGIN_X_LARGE
    },
    textWarn: {
        ...commonStyles.textWarnSmall,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        marginBottom: Constants.MARGIN_LARGE
    }
};
