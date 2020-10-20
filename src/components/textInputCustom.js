import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    Dimensions,
    ImageBackground,
    Image,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { Textarea, Input, InputGroup, Col } from 'native-base';
import commonStyles from 'styles/commonStyles';
import ic_next_white from 'images/ic_next_white.png';
import { Colors } from 'values/colors';
import Utils from 'utils/utils';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';
import { TextInputMask } from 'react-native-masked-text';
import Hr from './hr';
import { AnimatedRegion } from 'react-native-maps';
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableWithoutFeedback);

/**
 * This is text input custom without using state to change value
 * You can use this component instead of TextInput
 */

const heightDevice = Dimensions.get('window').height;

export default class TextInputCustom extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value ? props.value : null,
            isFocus: props.isFocus
        }
        this.animate = new Animated.Value(0)
    }

    componentDidMount = () => {
        console.log("this.state.value this.state.value", this.state.value == "" ? "Rỗng" : this.state.value == null ? "null" : this.state.value)
        Animated.spring(this.animate, {
            toValue: this.state.value == "" || this.state.value == null ? 0 : 1,
            friction: 5,
        }).start();
        if (this.state.value == "" || this.state.value == null) {

        } else {
            this.setState({
                isFocus: true
            })
        }
    }

    render () {
        const { isMultiLines, isInputAction, isInputNormal, isInputMask } = this.props
        return (
            <View>
                {isMultiLines ? this.renderInputMultiLines() : null}
                {isInputAction ? this.renderInputAction() : null}
                {isInputNormal ? this.renderInputOneLine() : null}
                {isInputMask ? this.renderInputMask() : null}
            </View>
        )
    }

    renderInputOneLine () {
        const { title, titleStyles, refInput, inputNormalStyle, autoCapitalize, returnKeyType, placeholder, styleRight,
            onSubmitEditing, keyboardType, secureTextEntry, borderBottomWidth, styleInputGroup, onPressRight, styleIcon,
            onPressPlaceHolder, textBackground, placeholderTextColor,
            visibleHr, onBlur, titleTop,
            onSelectionChange, blurOnSubmit, onFocus, numberOfLines, contentLeft = null, contentRight = null, styleTextInput } = this.props;
        const { isFocus } = this.state;
        // const titleStyle = {
        let top = this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [12, titleTop ? titleTop : -12],
        })

        // }
        return (
            <View style={[{
                flexDirection: 'column',
                borderWidth: 1.5,
                alignItems: 'center',
                borderRadius: Constants.CORNER_RADIUS * 3,
                padding: 2, paddingLeft: 4,
                borderColor: isFocus ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY
            }, styleTextInput]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    {!Utils.isNull(contentLeft) ? <Image source={contentLeft} style={{ marginLeft: Constants.MARGIN_LARGE }} /> : null}
                    <TextInput
                        {...this.props}
                        ref={refInput}
                        secureTextEntry={secureTextEntry}
                        placeholder={null}
                        placeholderTextColor={placeholderTextColor ? placeholderTextColor : Colors.COLOR_DRK_GREY}
                        returnKeyType={returnKeyType}
                        autoCapitalize={autoCapitalize}
                        style={[commonStyles.text, {
                            flex: 1,
                            margin: 0
                        }, inputNormalStyle]}
                        value={this.state.value}
                        onChangeText={this.changeText.bind(this)}
                        onSubmitEditing={onSubmitEditing}
                        keyboardType={keyboardType}
                        onSelectionChange={onSelectionChange}
                        blurOnSubmit={true}
                        onFocus={() => {
                            Animated.spring(this.animate, {
                                toValue: 1,
                                friction: 5,
                            }).start();
                            if (onFocus) {
                                onFocus()
                            };
                            this.setState({
                                isFocus: true
                            })

                        }}
                        onBlur={() => {
                            Animated.spring(this.animate, {
                                toValue: this.state.value == "" || this.state.value == null ? 0 : 1,
                                friction: 5,
                            }).start();
                            if (onBlur) {
                                onBlur()
                            }
                            this.setState({
                                isFocus: this.state.value == "" || this.state.value == null ? false : true
                            })
                        }}
                        numberOfLines={numberOfLines}
                    />
                    <Animated.Text
                        onPress={onPressPlaceHolder}
                        onLongPress={onPressPlaceHolder}
                        longPressDelayTimeout={1000}
                        style={[{
                            position: 'absolute', left: 8,
                            top: top,
                            backgroundColor: isFocus ? textBackground ? textBackground : 'transparent' : 'transparent', paddingLeft: 2, paddingRight: 4,
                            fontSize: isFocus ? Fonts.FONT_SIZE_X_SMALL : Fonts.FONT_SIZE_X_MEDIUM,
                            color: isFocus ? Colors.COLOR_TEXT_PRIMARY : placeholderTextColor ? placeholderTextColor : Colors.COLOR_DRK_GREY,
                        }]}>
                        {placeholder}
                    </Animated.Text>
                    <TouchableOpacity onPress={onPressRight} style={{ padding: Constants.PADDING_LARGE }}>
                        {!Utils.isNull(contentRight) ? <Image source={contentRight} style={[styleIcon]} /> : null}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderInputAction () {
        const { refInput, onPress, touchSpecialStyle, inputSpecialStyle, imageSpecialStyle, placeholder,
            myBackgroundColor, disabled, autoCapitalize, opacity, imgRight, title, onPressPlaceHolder,
            warnTitle, isValidate } = this.props;
        const { isFocus } = this.state;
        let top = this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [12, -12],
            // extrapolate: 'clamp'
        })
        return (
            <View style={[{
                flexDirection: 'column',
                borderWidth: 1.5,
                alignItems: 'center',
                borderRadius: Constants.CORNER_RADIUS * 3, paddingLeft: 4,
                borderColor: isFocus ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY
            }]}>
                <TouchableOpacity
                    disabled={disabled}
                    onPress={onPress}
                    activeOpacity={1}
                    style={[{
                        flexDirection: 'row',
                        marginVertical: Constants.MARGIN - 2,
                        marginHorizontal: Constants.MARGIN
                    }, touchSpecialStyle]}>
                    <TextInput
                        {...this.props}
                        autoCapitalize={autoCapitalize}
                        ref={refInput}
                        style={[commonStyles.text, {
                            flex: 1,
                            margin: 0,
                            backgroundColor: myBackgroundColor
                        }, inputSpecialStyle]}
                        placeholder={null}
                        value={this.state.value}
                        onChangeText={this.changeText.bind(this)}
                        underlineColorAndroid='transparent'
                        blurOnSubmit={false}
                        autoCorrect={false}
                        editable={false}
                        selectTextOnFocus={false}
                        onFocus={() => {
                            Animated.spring(this.animate, {
                                toValue: 1,
                                friction: 5,
                            }).start();
                            if (onFocus) {
                                onFocus()
                            };
                            this.setState({
                                isFocus: true
                            })
                        }}
                        onBlur={() => {
                            Animated.spring(this.animate, {
                                toValue: this.state.value == "" || this.state.value == null ? 0 : 1,
                                friction: 5,
                            }).start();
                            if (onBlur) {
                                onBlur()
                            }
                            this.setState({
                                isFocus: this.state.value == "" || this.state.value == null ? false : true
                            })
                        }}
                    />
                    <Animated.Text
                        onPress={onPressPlaceHolder}
                        onLongPress={onPressPlaceHolder}
                        longPressDelayTimeout={1000}
                        style={[{
                            position: 'absolute', left: 8,
                            top: this.state.value != null ? -12 : 12,
                            backgroundColor: Colors.COLOR_WHITE, paddingLeft: 2, paddingRight: 4,
                            fontSize: this.state.value != null ? Fonts.FONT_SIZE_X_SMALL : Fonts.FONT_SIZE_X_MEDIUM,
                            color: this.state.value != null ? Colors.COLOR_TEXT_PRIMARY : Colors.COLOR_DRK_GREY,
                        }]}>
                        {placeholder}
                    </Animated.Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderInputMask () {
        const { refInput, inputNormalStyle, autoCapitalize, returnKeyType, placeholder, onSubmitEditing,
            keyboardType, secureTextEntry, onSelectionChange, blurOnSubmit, styleInputGroup, visibleHr, onBlur,
            onFocus, numberOfLines, title, warnTitle, isValidate, typeFormat, options, onPressRight, onPressPlaceHolder,
            contentRight } = this.props;
        const { isFocus } = this.state;
        let top = this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [12, -12],
            // extrapolate: 'clamp'
        })
        return (
            <View style={[{
                flexDirection: 'column',
                borderWidth: 1.5,
                alignItems: 'center',
                borderRadius: Constants.CORNER_RADIUS * 3,
                padding: 2, paddingLeft: 4,
                borderColor: isFocus ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY
            }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <TextInputMask
                        {...this.props}
                        ref={refInput}
                        autoCapitalize={autoCapitalize}
                        secureTextEntry={secureTextEntry}
                        style={[commonStyles.text, {
                            margin: 0,
                            marginLeft: Constants.MARGIN_LARGE,
                            flex: 1
                        }, inputNormalStyle]}
                        placeholder={null}
                        returnKeyType={returnKeyType}
                        value={this.state.value}
                        onChangeText={this.changeText.bind(this)}
                        underlineColorAndroid='transparent'
                        keyboardType={keyboardType}
                        blurOnSubmit={() => {
                            Animated.spring(this.animate, {
                                toValue: this.state.value == "" || this.state.value == null ? 0 : 1,
                                friction: 5,
                            }).start();
                            if (blurOnSubmit) {
                                blurOnSubmit()
                            }
                            this.setState({
                                isFocus: this.state.value == "" || this.state.value == null ? false : true
                            })
                        }}
                        onSelectionChange={onSelectionChange}
                        onFocus={() => {
                            Animated.spring(this.animate, {
                                toValue: 1,
                                friction: 5,
                            }).start();
                            if (onFocus) {
                                onFocus()
                            };
                            this.setState({
                                isFocus: true
                            })
                        }}
                        onBlur={() => {
                            Animated.spring(this.animate, {
                                toValue: this.state.value == "" || this.state.value == null ? 0 : 1,
                                friction: 5,
                            }).start();
                            if (onBlur) {
                                onBlur()
                            }
                            this.setState({
                                isFocus: this.state.value == "" || this.state.value == null ? false : true
                            })
                        }}
                        type={typeFormat}
                        options={options}
                        numberOfLines={numberOfLines}
                    />
                    <Animated.Text
                        onPress={onPressPlaceHolder}
                        onLongPress={onPressPlaceHolder}
                        longPressDelayTimeout={1000}
                        style={[{
                            position: 'absolute', left: 8,
                            top: top,
                            backgroundColor: isFocus ? Colors.COLOR_WHITE : 'transparent', paddingLeft: 2, paddingRight: 4,
                            fontSize: isFocus ? Fonts.FONT_SIZE_X_SMALL : Fonts.FONT_SIZE_X_MEDIUM,
                            color: isFocus ? Colors.COLOR_TEXT_PRIMARY : Colors.COLOR_DRK_GREY,
                        }]}>
                        {placeholder}
                    </Animated.Text>
                    <TouchableOpacity onPress={onPressRight} style={{ paddingRight: Constants.PADDING_LARGE }}>
                        {!Utils.isNull(contentRight) ? <Image source={contentRight} style={{ marginRight: Constants.MARGIN_LARGE }} resizeMode={'contain'} /> : null}
                    </TouchableOpacity>
                    {visibleHr ? <View style={{ height: 1, backgroundColor: Colors.COLOR_PRIMARY, marginHorizontal: Constants.PADDING_LARGE }}></View> : null}
                </View>
            </View>
        )
    }

    renderInputMultiLines () {
        const { inputNormalStyle, refInput, onBlur, onFocus, styleInputGroup, hrEnable = true, placeholder, visibleHr, onPressPlaceHolder } = this.props;
        const { isFocus } = this.state;
        let top = this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: [12, -12],
            // extrapolate: 'clamp'
        })
        return (
            <View style={[{
                borderWidth: 1.5,
                alignItems: 'center',
                borderRadius: Constants.CORNER_RADIUS * 3,
                padding: 2, paddingLeft: 4,
                borderColor: isFocus ? Colors.COLOR_PRIMARY : Colors.COLOR_DRK_GREY
            }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <TextInput
                        {...this.props}
                        ref={refInput}
                        style={[commonStyles.text, {
                            flex: 1,
                            // margin: 0,
                            textAlignVertical: "top",
                        }, inputNormalStyle]}
                        placeholder={null}
                        onChangeText={this.changeText.bind(this)}
                        blurOnSubmit={false}
                        multiline={true}
                        onFocus={() => {
                            Animated.spring(this.animate, {
                                toValue: 1,
                                friction: 5,
                            }).start();
                            if (onFocus) {
                                onFocus()
                            };
                            this.setState({
                                isFocus: true
                            })
                        }}
                        onBlur={() => {
                            Animated.spring(this.animate, {
                                toValue: this.state.value == "" || this.state.value == null ? 0 : 1,
                                friction: 5,
                            }).start();
                            if (onBlur) {
                                onBlur()
                            }
                            this.setState({
                                isFocus: this.state.value == "" || this.state.value == null ? false : true
                            })
                        }}
                    />
                    <Animated.Text
                        onPress={onPressPlaceHolder}
                        onLongPress={onPressPlaceHolder}
                        longPressDelayTimeout={1000}
                        style={[{
                            position: 'absolute', left: 8,
                            top: top,
                            backgroundColor: isFocus ? Colors.COLOR_WHITE : 'transparent', paddingLeft: 2, paddingRight: 4,
                            fontSize: isFocus ? Fonts.FONT_SIZE_X_SMALL : Fonts.FONT_SIZE_X_MEDIUM,
                            color: isFocus ? Colors.COLOR_TEXT_PRIMARY : Colors.COLOR_DRK_GREY,
                        }]}>
                        {placeholder}
                    </Animated.Text>
                </View>
                {/* {visibleHr ? <View style={{height: 0.8, backgroundColor: Colors.COLOR_PRIMARY, marginHorizontal: Constants.PADDING_X_LARGE}}></View> : null} */}
            </View >
        )
    }

    renderTitle () {
        const { title, warnTitle, isValidate, titleStyles } = this.props;
        return (
            !Utils.isNull(title) || !Utils.isNull(warnTitle)
                ? <View style={{}}>
                    {!isValidate
                        ? <Text style={[commonStyles.textBold, {
                            marginHorizontal: 0,
                            marginBottom: 0,
                        }, titleStyles]}>
                            {title}
                        </Text>
                        : <Text style={[commonStyles.text, {
                            color: Colors.COLOR_RED,
                            marginLeft: Constants.MARGIN_X_LARGE,
                            marginTop: Constants.MARGIN_12,
                            marginBottom: 0
                        }]}>
                            {warnTitle}
                        </Text>
                    }
                </View>
                : null
        )
    }

    changeText (text) {
        if (this.props.onChangeText)
            this.props.onChangeText(text)
        else
            this.setState({
                value: text
            })

    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            value: nextProps.value
        })
        if (nextProps.value != null) {
            Animated.spring(this.animate, {
                toValue: 1,
                friction: 5,
            }).start();
            this.setState({
                isFocus: true
            })
        }
    }
}

const styles = StyleSheet.create({
    input: {
        ...commonStyles.viewHorizontal,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        marginVertical: Constants.MARGIN_LARGE,
    }
});