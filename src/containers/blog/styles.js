import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from 'values/constants'
import { Fonts } from 'values/fonts'
import commonStyles from 'styles/commonStyles'
const { Dimensions, Platform } = React;
const { StyleSheet } = React;

export default styles = {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND
    },
    textInput: {
        ...commonStyles.text,
        colors: Colors.COLOR_WHITE
    },
    main: {
        backgroundColor: Colors.COLOR_WHITE,
        borderBottomColor: Colors.COLOR_BACKGROUND, borderBottomWidth: 1,
        paddingVertical: Constants.PADDING_LARGE,
        paddingHorizontal: Constants.PADDING_X_LARGE,
        marginVertical: Constants.MARGIN_LARGE
    },
    commentDock: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT,
        width: Dimensions.get('window').width,
        flexDirection: 'column',
        backgroundColor: Colors.COLOR_WHITE,
        padding: Constants.PADDING,
        height: 50
    },
    contentContainer: {
        // ...commonStyles.cardView,
        paddingHorizontal: Constants.MARGIN_X_LARGE,
        backgroundColor: Colors.COLOR_WHITE,
        marginTop: Constants.MARGIN_X_LARGE,
        marginBottom: Constants.MARGIN_XX_LARGE
    },
    viewTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    txtTime: {
        ...commonStyles.text,
        marginTop: Constants.MARGIN_LARGE,
        marginBottom: Constants.MARGIN,
        margin: 0,
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
        marginRight: 0, flex: 1,
        opacity: 0.8
    },
    contentStyle: {
        marginBottom: Constants.MARGIN_LARGE,
        marginTop: Constants.MARGIN_LARGE,
        paddingVertical: Constants.MARGIN_LARGE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txtNameReply: {
        ...commonStyles.text,
        color: Colors.COLOR_GRAY,
        fontSize: Fonts.FONT_SIZE_X_SMALL,
        margin: 0, padding: 0,
        marginLeft: Constants.MARGIN_X_LARGE + Constants.MARGIN,
        marginBottom: Constants.MARGIN
    },
    btnCommentDock: {
        alignItems: 'center', marginHorizontal: Constants.MARGIN_X_LARGE, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'
    },
    txtNumComment: {
        position: 'absolute',
        textAlign: 'center',
        fontSize: Fonts.FONT_SIZE_X_SMALL,
        color: Colors.COLOR_WHITE,
        bottom: Constants.MARGIN_LARGE - 2,
    },
    tableDefaultStyle: {
        // flex: 1,
        justifyContent: 'flex-start',
        // borderWidth: 1,
        // borderColor: Colors.COLOR_BLACK
    },

    tableColumnStyle: {
        // flex: 1,
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: Colors.COLOR_BLACK,
        flexDirection: 'column',
        // alignItems: 'stretch'
    },

    tableRowStyle: {
        // flex: 1,
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: Colors.COLOR_BLACK,
        flexDirection: 'row',
        // alignItems: 'stretch'
    },
    tdStyle: {
        // flex: 1,
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: Colors.COLOR_BLACK,
        padding: 2
    },
    thStyle: {
        // flex: 1,
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: Colors.COLOR_BLACK,
        padding: 2,
        backgroundColor: '#CCCCCC',
        alignItems: 'center',
    }
}