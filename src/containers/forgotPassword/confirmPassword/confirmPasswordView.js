'use strict';
import React, { Component } from 'react';
import {
    View, TextInput, Image, StyleSheet, Text, ImageBackground, BackHandler,
    TouchableOpacity, StatusBar, TouchableHighlight, Keyboard, ScrollView
} from 'react-native';
import { Container, Form, Content, Item, Input, Button, Right, Icon, Header, Root, Left, Body, Title, Toast } from 'native-base';
import ButtonComp from 'components/button';
import StringUtil from 'utils/stringUtil';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import * as actions from 'actions/userActions';
import { connect } from 'react-redux';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { ErrorCode } from 'config/errorCode';
import Utils from 'utils/utils';
import StorageUtil from 'utils/storageUtil';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import GenderType from 'enum/genderType';
import statusType from 'enum/statusType';
import screenType from 'enum/screenType';
import TextInputCustom from 'components/textInputCustom';
import ic_logo_green from 'images/ic_log_splash.png';
import ic_eye_close from 'images/ic_eye_close.png';
import ic_eye_blue from 'images/ic_eye_blue.png';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import confirm_pass_bg from 'images/confirm_pass_bg.jpg';
import ic_back_blue from 'images/ic_back_blue.png';
import * as yup from 'yup';
import { Formik } from 'formik';
import ButtonPrimary from 'components/buttonPrimary';
import otpType from 'enum/otpType';

class ConfirmPasswordView extends BaseView {

    constructor(props) {
        super(props);
        const { route, navigation } = this.props;
        this.state = {
            hideNewPassword: true,
            hideRetypePassword: true,
            newPass: "",
            retypePass: "",
            showError: false
        };
        this.phone = route.params.phone;
        // this.phone = '0328440461';
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
      * Handle data when request
      */
    handleData () {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.RESET_PASSWORD)) {
                    if (data) {
                        this.showMessage("Cập nhật mật khẩu thành công");
                        this.props.navigation.pop(2)
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    componentDidMount () {
        StatusBar.setBackgroundColor('#0d1226', true);
        BackHandler.addEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    componentWillUnmount () {
        StatusBar.setBackgroundColor('#24336a', true);
        BackHandler.removeEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    // On press change password
    onPressUpdatePass = () => {
        let {
            newPass,
            retypePass
        } = this.state;
        if (newPass == "") {
            this.showMessage(localizes('confirmPassword.enterNewPass'))
            this.newPass.focus()
            return false
        } else if (newPass.length < 5) {
            this.showMessage(localizes('confirmPassword.vali_character_password'))
            this.newPass.focus()
            return false
        } else if (retypePass == "") {
            this.showMessage(localizes('confirmPassword.vali_fill_repeat_password'))
            this.retypePass.focus()
            return false
        } else if (newPass !== retypePass) {
            this.showMessage(localizes('confirmPassword.vali_confirm_password'))
            this.retypePass.focus()
            return false
        } else {
            this.props.changePass("", newPass, this.phone, screenType.FROM_FORGET_PASSWORD);
            return true
        }
    }

    renderForm = () => {
        let { showError } = this.state;
        return (
            <Formik
                initialValues={{ newPass: null, retypePass: null }}
                validationSchema={
                    yup.object().shape({
                        newPass: yup.string()
                            .required("Vui lòng nhập mật khẩu mới")
                            .nullable(),
                        retypePass: yup.string().when("newPass", {
                            is: val => (val && val.length > 0 ? true : false),
                            then: yup.string().oneOf(
                                [yup.ref("newPass")],
                                "Mật khẩu nhập lại không đúng"
                            )
                        }).nullable(),
                    })}
                onSubmit={values => {
                    let filter = {
                        newPass: values.newPass,
                        phone: this.phone
                    }
                    this.props.resetPassword(filter)
                }}
            >
                {({ values, handleChange, errors, handleSubmit }) => (
                    <View style={{ marginHorizontal: Constants.MARGIN_X_LARGE }}>
                        <View style={{ justifyContent: 'center', position: 'relative', marginVertical: Constants.MARGIN_X_LARGE }}>
                            <TextInputCustom
                                refInput={ref => this.newPass = ref}
                                isInputNormal={true}
                                styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS, }}
                                placeholder={localizes('forgot_password.input_newPass')}
                                value={values.newPass}
                                secureTextEntry={this.state.hideNewPassword}
                                onChangeText={(newPass) => {
                                    if (showError) {
                                        this.setState({
                                            showError: false
                                        })
                                    }
                                    handleChange("newPass")(newPass)
                                }}
                                onSelectionChange={({ nativeEvent: { selection } }) => {
                                    console.log(this.className, selection)
                                }}
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    this.retypePass.focus()
                                }}
                                inputNormalStyle={{
                                    paddingRight: Constants.PADDING_LARGE * 5,
                                    color: Colors.COLOR_WHITE
                                }}
                                titleTop={-24}
                                onPressPlaceHolder={() => { this.newPass.focus() }}
                            />
                            <TouchableHighlight
                                onPress={() => {
                                    this.setState({ hideNewPassword: !this.state.hideNewPassword })
                                }}
                                style={[commonStyles.shadowOffset, {
                                    position: 'absolute', right: Constants.PADDING_LARGE * 4
                                }]}
                                underlayColor='transparent'
                            >
                                <Image style={{ resizeMode: 'contain', width: 17, height: 17 }}
                                    source={(this.state.hideNewPassword) ? ic_eye_close : ic_eye_blue} />
                            </TouchableHighlight>
                        </View>
                        {errors && errors.newPass && showError && <Text style={styles.textWarn}>{errors.newPass}</Text>}
                        <View style={{ justifyContent: 'center', position: 'relative', marginVertical: Constants.MARGIN_X_LARGE }}>
                            <TextInputCustom
                                refInput={ref => this.retypePass = ref}
                                isInputNormal={true}
                                styleInputGroup={{ borderRadius: Constants.CORNER_RADIUS }}
                                placeholder={"Nhập lại mật khẩu mới"}
                                value={values.retypePass}
                                secureTextEntry={this.state.hideRetypePassword}
                                onChangeText={(retypePass) => {
                                    if (showError) {
                                        this.setState({
                                            showError: false
                                        })
                                    }
                                    handleChange("retypePass")(retypePass)
                                }}
                                onSelectionChange={({ nativeEvent: { selection } }) => {
                                    console.log(this.className, selection)
                                }}
                                returnKeyType={"done"}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                }}
                                inputNormalStyle={{
                                    paddingRight: Constants.PADDING_LARGE * 5,
                                    color: Colors.COLOR_WHITE
                                }}
                                titleTop={-24}
                                onPressPlaceHolder={() => { this.retypePass.focus() }}
                            />
                            <TouchableHighlight
                                onPress={() => {
                                    this.setState({ hideRetypePassword: !this.state.hideRetypePassword })
                                }}
                                style={[commonStyles.shadowOffset, {
                                    position: 'absolute', right: Constants.PADDING_LARGE * 4
                                }]}
                                underlayColor='transparent'
                            >
                                <Image style={{ resizeMode: 'contain', width: 17, height: 17 }}
                                    source={(this.state.hideRetypePassword) ? ic_eye_close : ic_eye_blue} />
                            </TouchableHighlight>
                        </View>
                        {errors && errors.retypePass && showError && <Text style={styles.textWarn}>{errors.retypePass}</Text>}
                        <View style={{ alignItems: 'center', marginTop: Constants.MARGIN_X_LARGE }}>
                            <ButtonPrimary title={"Đồng ý"} onPress={() => {
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
        StatusBar.setBackgroundColor('#0d1226', true);
        return (
            <Container style={[styles.container]}>
                <ImageBackground source={confirm_pass_bg} style={{ flex: 1 }} blurRadius={0}>

                    <Content
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', }}
                        style={[{ flex: 1 }]}
                    >
                        <Text style={[commonStyles.titleInputForm, {
                            alignItems: 'flex-start',
                            marginLeft: 0, textAlign: 'center',
                            color: Colors.COLOR_WHITE,
                            marginBottom: Constants.MARGIN_XX_LARGE
                        }]}>Cập nhật mật khẩu</Text>
                        {this.renderForm()}
                    </Content>
                    {this.showLoadingBar(this.props.isLoading)}
                    <TouchableOpacity
                        onPress={() => { this.onBack(); }}
                        style={{
                            padding: Constants.PADDING_X_LARGE,
                            position: 'absolute'
                        }}>
                        <Image source={ic_back_blue} />
                    </TouchableOpacity>
                </ImageBackground>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    data: state.changePass.data,
    action: state.changePass.action,
    isLoading: state.changePass.isLoading,
    error: state.changePass.error,
    errorCode: state.changePass.errorCode
});

export default connect(mapStateToProps, actions)(ConfirmPasswordView);
