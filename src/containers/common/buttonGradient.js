import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground, ActivityIndicator, Dimensions, View, StatusBar, TextInput, ScrollView, Pressable } from "react-native";
import { Form, Textarea, Container, Header, Title, Left, Icon } from "native-base";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";
import Utils from "utils/utils";
import StringUtil from "utils/stringUtil";
import LinearGradient from "react-native-linear-gradient";
import { localizes } from 'locales/i18n';

export default class ButtonGradient extends BaseView {
    static defaultProps = {
        title: '',
        titleStyle: {},
        buttonStyle: {},
        onPress: null,
        disableButton: false,
        viewStyle: {},
        isLoading: false,
        //onPressItem: this.props.onPress ? this.props.onPress : this.onPressCommonButton.bind(this)
    }
    constructor(props) {
        super(props)
    }
    onPressCommonButton() {
    }
    render() {
        const { onPress, title, titleStyle, buttonStyle, isLoading, viewStyle, disableButton, styles } = this.props
        return (

            <View style={[viewStyle]}>
                <Pressable
                    android_ripple={{
                        color: Colors.COLOR_WHITE,
                        borderless: false,
                    }}
                    disabled={disableButton}
                    onPress={onPress}>
                    <LinearGradient colors={['#139e8d', '#34e77f']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[commonStyles.shadowOffset, commonStyles.buttonStyle, buttonStyle, {
                            paddingVertical: Constants.PADDING_X_LARGE,
                            margin: 0,
                            borderRadius: Constants.CORNER_RADIUS / 2,
                            marginHorizontal: Constants.MARGIN_X_LARGE,
                        }, styles]}>
                        {!isLoading
                            ? <Text style={[commonStyles.text, titleStyle]} >
                                {title}
                            </Text>
                            : <ActivityIndicator color={Colors.COLOR_WHITE} animating size="large" />
                        }
                    </LinearGradient>
                </Pressable>
            </View >
            // </View>
        )
    }
}