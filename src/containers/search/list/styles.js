import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from 'values/constants';
import { Fonts } from "values/fonts";
import { CheckBox } from "native-base";
import commonStyles from "styles/commonStyles";
const { Dimensions, Platform } = React;
const { StyleSheet } = React;

const HEIGHT_ITEM = 52

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND
    },
    item: {
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Constants.PADDING_LARGE + Constants.PADDING
    },
    itemList: {
        backgroundColor: Colors.COLOR_BACKGROUND,
        padding: Constants.PADDING,
        margin: Constants.MARGIN_LARGE,
        borderRadius: Constants.CORNER_RADIUS * 6
    },
    listOption: {
        ...commonStyles.shadowOffset,
        backgroundColor: Colors.COLOR_WHITE,
        flexBasis: 56
    }
};