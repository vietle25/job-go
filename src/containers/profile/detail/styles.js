import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from 'values/constants'
import commonStyles from "styles/commonStyles";
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get('window').width;
const { StyleSheet } = React;

export default styles = {
    textMenu: {
        ...commonStyles.text,
        flex: 1
    },
    itemSliding: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginHorizontal: Constants.PADDING_X_LARGE,
        paddingVertical: Constants.PADDING_LARGE,
        marginVertical: Constants.MARGIN_LARGE
    },
    infoTitle: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginHorizontal: Constants.PADDING_X_LARGE,
        paddingBottom: Constants.PADDING_X_LARGE,
        marginTop: Constants.MARGIN_LARGE,
    },
    shopInfoTitle: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginHorizontal: Constants.PADDING_X_LARGE,
        paddingBottom: Constants.PADDING_X_LARGE,
        marginTop: Constants.MARGIN_X_LARGE
    }
}
