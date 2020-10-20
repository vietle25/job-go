'use strict';
import React, { Component } from 'react';
import {
    View, TextInput, Image, StyleSheet, Text, ImageBackground, Keyboard, ToastAndroid, TouchableOpacity, BackHandler,
    StatusBar, ScrollView
} from 'react-native';
import { Container, Form, Content, Item, Input, Button, Right, Radio, center, ListItem, Left, Root, Header, Body } from 'native-base';
import ButtonComp from 'components/button';
import StringUtil, { capitalizeFirstLetter } from 'utils/stringUtil';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import { Colors } from 'values/colors';
import I18n from 'react-native-i18n';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import { Icon } from 'react-native-elements';
import Utils from 'utils/utils'
import * as actions from 'actions/userActions';
import { connect } from 'react-redux';
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import StorageUtil from 'utils/storageUtil';
import screenType from 'enum/screenType';
import TextInputCustom from 'components/textInputCustom';
import OTPType from 'enum/otpType';
import ic_logo_green from 'images/ic_log_splash.png';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import ic_phone_receiver_green from 'images/ic_cancel_blue.png';
import LinearGradient from "react-native-linear-gradient";
import ic_logo from 'images/ic_log_splash.png';
import ButtonPrimary from 'components/buttonPrimary';
import forgot_pass_bg from 'images/forgot_pass_bg.jpg';
import ic_back_blue from 'images/ic_back_blue.png';
import * as yup from 'yup';
import { Formik } from 'formik';
import otpType from 'enum/otpType';

class ForgotPasswordView extends BaseView {

    constructor(props) {
        super(props);
        const { route, navigation } = this.props;
        this.state = {
            phone: null,
            isAlertSuccess: false,
            showError: false
        }
    };

    componentDidMount () {
        BackHandler.addEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    componentWillUnmount () {
        StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY, true);
        BackHandler.removeEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    // Forget password
    onForgotPass = () => {
        var { email } = this.state;
        const res = email.charAt(0);
        if (Utils.isNull(email.trim())) {
            this.showMessage(localizes("register.vali_fill_email"))
        } else if (!Utils.validateEmail(email.trim())) {
            this.showMessage(localizes("register.vali_email"))
        } else {
            //let email = email //this.isEmail ? email : "";
            this.props.forgetPass(email.trim(), "");
        }
    }

    handleData () {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.FORGET_PASS)) {
                    console.log("data foget password:", data)
                    if (data != null) {
                        this.props.navigation.navigate("OTP", { type: OTPType.FORGOT_PASS, phone: this.state.phone });
                    } else {
                        this.showMessage(localizes('forgot_password.existsPhone'))
                    }
                }
            } else if (this.props.errorCode == ErrorCode.USER_HAS_BEEN_DELETED) {
                if (this.props.action == getActionSuccess(ActionEvent.FORGET_PASS)) {
                    this.showMessage(localizes('forgot_password.locked_accout'))
                }
            } else if (this.props.errorCode == ErrorCode.INVALID_ACCOUNT) {
                if (this.props.action == getActionSuccess(ActionEvent.FORGET_PASS)) {
                    this.showMessage('Email không tồn tại')
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData();
        }
    }


    renderForm = () => {
        let { showError } = this.state;
        return (
            <Formik
                initialValues={{ phone: null }}
                validationSchema={
                    yup.object().shape({
                        phone: yup.string()
                            .matches(StringUtil.phoneRegExp, 'Số điện thoại không hợp lệ')
                            .required("Số điện thoại là bắt buộc")
                            .nullable()
                    })}
                onSubmit={values => {
                    this.setState({
                        phone: values.phone
                    })
                    this.props.forgetPass({ phone: values.phone.trim(), type: otpType.FORGOT_PASS });
                }}
            >
                {({ values, handleChange, errors, handleSubmit }) => (
                    <View style={{ marginHorizontal: Constants.MARGIN_X_LARGE }}>
                        <TextInputCustom
                            styleTextInput={{
                                marginTop: Constants.MARGIN_X_LARGE,
                                marginBottom: Constants.MARGIN_LARGE
                            }}
                            refInput={input => (this.phone = input)}
                            isInputNormal={true}
                            placeholder={"Số điện thoại"}
                            value={values.phone}
                            onChangeText={(txt) => {
                                handleChange('phone')(txt);
                                if (showError) {
                                    this.setState({
                                        showError: false
                                    })
                                }
                            }}
                            keyboardType="numeric"
                            inputNormalStyle={styles.inputNormal}
                            onSubmitEditing={() => {
                                this.phone.focus();
                                this._container.scrollTo({ x: 0, y: 50, animated: true });
                            }}
                            returnKeyType={'next'}
                            autoCapitalize={'words'}
                            titleTop={-24}
                            onPressPlaceHolder={() => { this.phone.focus() }}
                        />
                        {errors && errors.phone && showError && <Text style={styles.textWarn}>{errors.phone}</Text>}
                        <View style={{ alignItems: 'center', marginTop: Constants.MARGIN_X_LARGE }}>
                            <ButtonPrimary title={"Gửi yêu cầu"} onPress={() => {
                                this.setState({
                                    showError: true
                                })
                                handleSubmit()
                            }} />
                        </View>
                    </View>
                )}
            </Formik>
        )
    }


    render () {
        StatusBar.setBackgroundColor('#24336a', true);
        return (
            <Container style={[styles.container]}>
                <ImageBackground source={forgot_pass_bg} style={{ flex: 1 }} blurRadius={0}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        style={styles.scrollView}
                        keyboardShouldPersistTaps="handled"
                        ref={r => (this._container = r)}
                        scrollEnabled={this.state.enableScrollViewScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={[commonStyles.titleInputForm, {
                            alignItems: 'flex-start',
                            marginLeft: 0, textAlign: 'center',
                            color: Colors.COLOR_WHITE,
                            marginBottom: Constants.MARGIN_X_LARGE
                        }]}>Quên mật khẩu</Text>
                        <Text style={{
                            color: Colors.COLOR_WHITE, textAlign: 'center', marginHorizontal: Constants.MARGIN_XX_LARGE,
                            marginVertical: Constants.MARGIN_X_LARGE
                        }}>Nhập số điện thoại bạn đã đăng ký để lấy lại mật khẩu</Text>
                        {this.renderForm()}
                    </ScrollView>
                    <TouchableOpacity
                        onPress={() => { this.onBack(); }}
                        style={{
                            padding: Constants.PADDING_X_LARGE,
                            position: 'absolute'
                        }}>
                        <Image source={ic_back_blue} />
                    </TouchableOpacity>
                </ImageBackground>
                {this.showLoadingBar(this.props.isLoading)}
            </Container>
        )
    }
}
const mapStateToProps = state => ({
    data: state.forgetPass.data,
    action: state.forgetPass.action,
    isLoading: state.forgetPass.isLoading,
    error: state.forgetPass.error,
    errorCode: state.forgetPass.errorCode
});
export default connect(mapStateToProps, actions)(ForgotPasswordView);