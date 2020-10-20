'use strict';
import React, { Component } from 'react';
import {
    Dimensions, View, TextInput, Image, StyleSheet, Text, PixelRatio, ImageBackground,
    Platform, TouchableHighlight, TouchableOpacity, Keyboard, ToastAndroid, ScrollView, Modal, StatusBar,
    BackHandler
} from 'react-native';
import {
    Container, Form, Content, Input, Button, Right, Radio, center, ListItem,
    Left, Header, Item, Picker, Body, Root,
} from 'native-base';
import ButtonComp from 'components/button';
import { capitalizeFirstLetter } from 'utils/stringUtil';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import I18n from 'react-native-i18n';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { CheckBox } from 'react-native-elements';
import { Constants } from 'values/constants';
import Utils from 'utils/utils';
import { connect } from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import { ErrorCode } from 'config/errorCode';
import { getActionSuccess, ActionEvent } from 'actions/actionEvent';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import StringUtil from 'utils/stringUtil';
import screenType from 'enum/screenType';
import TextInputCustom from 'components/textInputCustom';
import ic_eye_blue from 'images/ic_eye_blue.png';
import ic_eye_close from 'images/ic_eye_close.png';
import statusType from 'enum/statusType';
import ButtonPrimary from 'components/buttonPrimary';
import * as yup from 'yup';
import { Formik } from 'formik';
import ic_back_blue from 'images/ic_back_blue.png';
import register from 'images/register.png';
import ic_back_white from 'images/ic_back_white.png';
import NotificationType from 'enum/notificationType';

const deviceHeight = Dimensions.get('window').height;
const MARGIN_BETWEEN_ITEM = 0;

class RegisterView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            fullName: '',
            password: '',
            email: '',
            repeatPassword: '',
            hidePassword: true,
            hideConfirmPassword: true,
            enableScrollViewScroll: true,
            showError: false
        };
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", () => { this.handlerBackButton });
        setTimeout(() => {
            this.setState({
                phone: '',
                fullName: '',
                password: '',
                email: '',
                repeatPassword: '',
            }, () => { });
        }, 50);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    /**
     * manage password visibility
     */
    managePasswordVisibility = () => {
        let last = this.state.password;
        this.setState({ hidePassword: !this.state.hidePassword, password: '' });
        setTimeout(() => {
            this.setState({ password: last });
        }, 0);
    };

    /**
       * Manage Confirm Password Visibility
       */
    manageConfirmPasswordVisibility = () => {
        let last = this.state.confirmPassword;
        this.setState({
            hideConfirmPassword: !this.state.hideConfirmPassword,
            confirmPassword: '',
        });
        setTimeout(() => {
            this.setState({ confirmPassword: last });
        }, 0);
    };

    // /**
    //    * Validate and sign up
    //    */
    validateAndSignUp = () => {
        const { fullName, password, phone, repeatPassword, email } = this.state;
        let type = [];
        let certificatePath = [];
        if (this.state.images != null) {
            for (let i = 0; i < this.state.images.length; i++) {
                certificatePath.push(this.state.images[i].uri);
            }
        }
        type.push(this.selectedType);
        const res = phone.trim().charAt(0);
        if (Utils.isNull(fullName) || fullName.trim().length == 0) {
            this.showMessage(localizes('register.vali_fill_fullname'));
            this.setState({
                fullName: ''
            })
            this.fullName.focus();
        }
        else if (StringUtil.validSpecialCharacter(fullName.trim()) ||
            StringUtil.validEmojiIcon(fullName)) {
            this.showMessage(localizes('register.vali_fullname'));
            this.fullName.focus();
        }
        else if (StringUtil.validSpecialCharacter2(fullName.trim())) {
            this.showMessage(localizes('register.vali_fullname'));
            this.fullName.focus();
        }
        else if (fullName.length > 60) {
            this.showMessage(localizes('register.vali_fullname_length'));
            this.fullName.focus();
        } else if (Utils.isNull(phone)) {
            this.showMessage(localizes('register.vali_fill_phone'));
            this.phone.focus();
        }
        // ======= PHONE ======= 
        // không ký tự đặc biệt 
        else if (phone.trim().includes(" ") && phone.trim() == '') {
            this.showMessage(localizes('register.vali_fill_phone'));
            this.setState({ phone: '' }, () => { });
            this.phone.focus();
        }
        else if (Utils.validatePhoneContainSpecialCharacter(phone.trim()) ||
            Utils.validatePhoneContainWord(phone.trim())) {
            this.showMessage(localizes('register.errorPhone'));
            this.phone.focus();
        } else if (phone.trim().includes(" ")) {
            this.showMessage(localizes('register.errorPhone'));
            this.phone.focus();
        }
        else if (phone.trim().length != 10 || res != '0') {
            this.showMessage(localizes('register.errorPhone'));
            this.phone.focus();
        }
        else if (!Utils.validatePhone(phone.trim())) {
            this.showMessage(localizes('register.vali_phone'));
            this.phone.focus();
        } else if (Utils.isNull(email) || email.trim().length == 0) {
            // Email
            this.showMessage(localizes('register.vali_fill_email'));
            this.setState({ email: '' }, () => { });
            this.email.focus();
        } else if (StringUtil.validSpecialCharacterForEmail(email.trim())) {
            this.showMessage(localizes('register.vali_email'));
            this.email.focus();
        }
        else if (!Utils.validateEmail(email.trim())) {
            this.showMessage(localizes('register.vali_email'));
            this.email.focus();
        } else if (email.trim().length > 150) {
            this.showMessage(localizes('register.vali_email_length'));
            this.email.focus();
        } else if (email.includes(',')) {
            this.showMessage(localizes('register.vali_email'));
            this.email.focus();
        } else if (password == '') {
            this.showMessage(localizes('register.vali_empty_password'));
            this.password.focus();
        } else if (password.trim() == '') {
            this.showMessage(localizes('register.vali_empty_space_password'));
            this.password.focus();
        } else if (Utils.isNull(password)) {
            this.showMessage(localizes('register.vali_fill_password'));
            this.password.focus();
        } else if (password.includes(" ")) {
            this.showMessage(localizes('register.vali_empty_space_password'));
            this.password.focus();
        } else if (password.length < 6 || password.length > 20) {
            this.showMessage(localizes('register.vali_character_password'));
            this.password.focus();
        } else if (!Utils.validateContainUpperPassword(password)) {
            this.showMessage(localizes('register.vali_character_password'));
            this.password.focus();
        } else if (Utils.isNull(repeatPassword)) {
            this.showMessage(localizes('register.vali_fill_repeat_password'));
            this.confirmPassword.focus();
        } else if (password != repeatPassword) {
            this.showMessage(localizes('register.vali_confirm_password'));
            this.confirmPassword.focus();
        } else {
            // xử lý name
            // bỏ khoảng trắng 2 bên 
            let newName = Utils.cloneObject(this.state.fullName);
            newName = newName.trim();
            for (let i = 0; i < newName.length; i++) {
                newName = newName.replace('  ', ' ');
            }

            let signUpData = {
                // name: this.state.fullName.trim(),
                name: StringUtil.validMultipleSpace(newName.trim()),
                phone: phone.trim(),
                password: this.state.password.trim(),
                email: this.state.email.trim().toLowerCase()
            };
            this.props.signUp(signUpData);
        }
        this._container.scrollTo({ x: 0, y: 0, animated: true });
    }

    /**
     * focus input
     * @param {*} text 
     */
    focusInput(text) {
        if (this.isFirstTime) return true;
        return text !== '';
    }

    /**
       * Handle data when request
       */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.SIGN_UP)) {
                    if (!Utils.isNull(data)) {
                        StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
                        // if (data.status == statusType.ACTIVE) {
                        this.showMessage(localizes('register.register_success'));
                        setTimeout(() => {
                            StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
                            //Save token login
                            StorageUtil.storeItem(StorageUtil.USER_TOKEN, data.token);
                            StorageUtil.storeItem(
                                StorageUtil.FIREBASE_TOKEN,
                                data.firebaseToken
                            );
                            global.token = data.token;
                            global.firebaseToken = data.firebaseToken;
                            this.props.notifyLoginSuccess();
                            // this.goHomeScreen() //Register successfully => Main
                            // this.props.navigation.replace('Home')
                            this.goHomeScreen();
                            global.registerSuccess = true
                            this.onRefreshToken(data)
                        }, 3000);
                        // }
                        // else if (data.status == statusType.DRAFT) {
                        //     this.props.navigation.pop();
                        //     this.props.navigation.navigate("OTP", {
                        //         'fromScreen': screenType.FROM_REGISTER,
                        //         'phone': this.state.phone,
                        //         'sendType': OTPType.REGISTER
                        //     });
                        // }
                    }
                }
            } else if (this.props.errorCode == ErrorCode.USER_EXIST_TRY_LOGIN_FAIL) {
                this.showMessage(localizes('register.existMobile'));
                this.phone.focus();
            }
            else if (this.props.errorCode == ErrorCode.USER_EMAIL_ALREADY_TAKEN) {
                this.showMessage(localizes('register.existEmail'));
                this.email.focus();
            } else if (this.props.errorCode == ErrorCode.USER_HAS_BEEN_DELETED) {
                this.showMessage(localizes('login.userHasBeenDeleted'));
                // this.phone.focus();
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    onRefreshToken = async (data) => {
        await this.refreshToken();
        // StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN).then((token) => {
        //     this.props.pushNotification({
        //         title: "Đăng ký tài khoản thành công",
        //         content: "Đăng ký tài khoản thành công, bắt đầu tìm việc hoặc đăng tin tuyển dụng ngay nhé",
        //         type: NotificationType.COMMON_NOTIFICATION,
        //         meta: null,
        //         token: token
        //     })
        // }).catch((error) => {
        //     console.log('Promise is rejected with error: ' + error);
        // });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    renderForm = () => {
        let { showError } = this.state;
        return (
            <Formik
                initialValues={{ name: null, phone: null, password: null, repeatPassword: null, email: null }}
                validationSchema={
                    yup.object().shape({
                        name: yup.string()
                            // .matches(StringUtil.specialCharacter, "Tên không được chứa ký tự đặc biệt")
                            .max(60, "Độ dài tối đa là 60 ký tự")
                            .required("Tên là bắt buộc").nullable(),
                        phone: yup.string()
                            .matches(StringUtil.phoneRegExp, 'Số điện thoại không hợp lệ')
                            .required("Số điện thoại là bắt buộc")
                            .nullable(),
                        password: yup.string()
                            .min(6, "Mật khẩu ít nhất 6 ký tự")
                            .required("Mật khẩu là bắt buộc").nullable(),
                        repeatPassword: yup.string().when("password", {
                            is: val => (val && val.length > 0 ? true : false),
                            then: yup.string().oneOf(
                                [yup.ref("password")],
                                "Mật khẩu nhập lại không đúng"
                            )
                        }).nullable(),
                        email: yup.string()
                            .email("Email không hợp lệ")
                            .max(255, "Độ dài tối đa của email là 255 ký tự")
                            .required("Email là bắt buộc").nullable(),
                    })}
                onSubmit={values => {
                    let signUpData = {
                        name: values.name.trim(),
                        phone: values.phone.trim(),
                        password: values.password.trim(),
                        email: values.email.trim().toLowerCase()
                    };
                    this.props.signUp(signUpData);
                }}
            >
                {({ values, handleChange, errors, handleSubmit }) => (
                    <View style={{ marginHorizontal: Constants.MARGIN_X_LARGE }}>
                        <TextInputCustom
                            styleTextInput={{
                                marginTop: Constants.MARGIN_X_LARGE,
                                marginBottom: Constants.MARGIN_LARGE
                            }}
                            refInput={input => (this.name = input)}
                            isInputNormal={true}
                            placeholder={localizes('register.contactName')}
                            value={values.name}
                            onChangeText={(txt) => {
                                handleChange('name')(txt);
                                if (showError) {
                                    this.setState({
                                        showError: false
                                    })
                                }
                            }}
                            inputNormalStyle={styles.inputNormal}
                            onSubmitEditing={() => {
                                this.phone.focus();
                                this._container.scrollTo({ x: 0, y: 50, animated: true });
                            }}
                            returnKeyType={'next'}
                            autoCapitalize={'words'}
                            titleTop={-24}
                            onPressPlaceHolder={() => { this.name.focus() }}
                        />
                        {errors && errors.name && showError && <Text style={styles.textWarn}>{errors.name}</Text>}
                        <TextInputCustom
                            backgroundColor={Colors.COLOR_TRANSPARENT}
                            styleTextInput={{
                                marginTop: Constants.MARGIN_X_LARGE,
                                marginBottom: Constants.MARGIN_LARGE
                            }}
                            placeholder={localizes('register.phone')}
                            refInput={r => (this.phone = r)}
                            isInputNormal={true}
                            value={values.phone}
                            onChangeText={(txt) => {
                                handleChange('phone')(txt);
                                if (showError) {
                                    this.setState({
                                        showError: false
                                    })
                                }
                            }}
                            onSubmitEditing={() => {
                                this.email.focus();
                                this._container.scrollTo({ x: 0, y: 100, animated: true });
                            }}
                            returnKeyType={'next'}
                            inputNormalStyle={styles.inputNormal}
                            keyboardType="phone-pad"
                            titleTop={-24}
                            onPressPlaceHolder={() => { this.phone.focus() }}
                        />
                        {errors && errors.phone && showError && <Text style={styles.textWarn}>{errors.phone}</Text>}
                        <TextInputCustom
                            backgroundColor={Colors.COLOR_TRANSPARENT}
                            styleTextInput={{
                                marginTop: Constants.MARGIN_X_LARGE,
                                marginBottom: Constants.MARGIN_LARGE
                            }}
                            placeholder={localizes('register.email')}
                            refInput={r => (this.email = r)}
                            isInputNormal={true}
                            value={values.email}
                            onChangeText={(txt) => {
                                handleChange('email')(txt);
                                if (showError) {
                                    this.setState({
                                        showError: false
                                    })
                                }
                            }}
                            onSubmitEditing={() => {
                                this.password.focus();
                                this._container.scrollTo({ x: 0, y: 100, animated: true });
                            }}
                            returnKeyType={'next'}
                            inputNormalStyle={styles.inputNormal}
                            keyboardType="email-address"
                            autoCapitalize='none'
                            titleTop={-24}
                            onPressPlaceHolder={() => { this.email.focus() }}
                        />
                        {errors && errors.email && showError && <Text style={styles.textWarn}>{errors.email}</Text>}
                        <View
                            style={{
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            <TextInputCustom
                                backgroundColor={Colors.COLOR_TRANSPARENT}
                                refInput={input => {
                                    this.password = input;
                                }}
                                styleTextInput={{
                                    marginTop: Constants.MARGIN_X_LARGE,
                                    marginBottom: Constants.MARGIN_LARGE
                                }}
                                isInputNormal={true}
                                placeholder={localizes('register.input_password')}
                                value={values.password}
                                onChangeText={(txt) => {
                                    handleChange('password')(txt);
                                    if (showError) {
                                        this.setState({
                                            showError: false
                                        })
                                    }
                                }}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                numberOfLines={1}
                                secureTextEntry={this.state.hidePassword}
                                inputNormalStyle={styles.inputNormal}
                                // autoCapitalize='sentences'
                                titleTop={-24}
                                onPressPlaceHolder={() => { this.password.focus() }}
                            />
                            <TouchableHighlight
                                onPress={this.managePasswordVisibility}
                                style={[commonStyles.shadowOffset, {
                                    position: 'absolute',
                                    padding: Constants.PADDING_LARGE,
                                    right: 0,
                                }]}
                                underlayColor='transparent'
                            >
                                <Image style={{ resizeMode: 'contain', width: 18, height: 18 }}
                                    source={(this.state.hidePassword) ? ic_eye_blue : ic_eye_close} />
                            </TouchableHighlight>
                        </View>
                        {errors && errors.password && showError && <Text style={styles.textWarn}>{errors.password}</Text>}
                        <View style={styles.viewConfirmPassword}>
                            <TextInputCustom
                                backgroundColor={Colors.COLOR_TRANSPARENT}
                                styleTextInput={{
                                    marginTop: Constants.MARGIN_X_LARGE,
                                    marginBottom: Constants.MARGIN_LARGE
                                }}
                                refInput={input => {
                                    this.confirmPassword = input;
                                }}
                                isInputNormal={true}
                                placeholder={localizes('register.confirmPass')}
                                value={values.repeatPassword}
                                onChangeText={(txt) => {
                                    handleChange('repeatPassword')(txt);
                                    if (showError) {
                                        this.setState({
                                            showError: false
                                        })
                                    }
                                }}
                                onSubmitEditing={() => {
                                    this.validateAndSignUp();
                                }}
                                returnKeyType={'next'}
                                blurOnSubmit={false}
                                numberOfLines={1}
                                secureTextEntry={this.state.hideConfirmPassword}
                                inputNormalStyle={styles.inputNormal}
                                // autoCapitalize='none'
                                titleTop={-24}
                                onPressPlaceHolder={() => { this.confirmPassword.focus() }}
                            />
                            <TouchableHighlight
                                onPress={this.manageConfirmPasswordVisibility}
                                style={[commonStyles.shadowOffset, {
                                    position: 'absolute', padding: Constants.PADDING_LARGE,
                                    right: 0,
                                }]}
                                underlayColor='transparent'
                            >
                                <Image style={{ resizeMode: 'contain', width: 18, height: 18 }}
                                    source={(this.state.hideConfirmPassword) ? ic_eye_blue : ic_eye_close} />
                            </TouchableHighlight>
                        </View>
                        {errors && errors.repeatPassword && showError && <Text style={styles.textWarn}>
                            {errors.repeatPassword}</Text>}
                        <View style={{ alignItems: 'center', marginTop: Constants.MARGIN_X_LARGE }}>
                            <ButtonPrimary title={"Đăng ký"} onPress={() => {
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

    render() {
        StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY, true);
        return (
            <Container style={[styles.container]}>
                <Root>
                    <View style={{
                        position: 'absolute',
                        top: 0, right: 0,
                    }}>
                        <Image source={register} style={{
                            width: Constants.MAX_WIDTH,
                            height: Constants.MAX_WIDTH / 1.8
                        }} />
                    </View>
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
                            marginBottom: Constants.MARGIN_X_LARGE,
                            color: Colors.COLOR_TEXT
                        }]}>Đăng ký</Text>
                        {this.renderForm()}
                    </ScrollView>
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={{
                            justifyContent: 'center',
                            padding: Constants.PADDING_X_LARGE,
                            alignItems: 'center',
                            width: Constants.MAX_WIDTH - Constants.MARGIN_XX_LARGE
                        }}
                        onPress={() => {
                            this.onBack();
                        }}
                    >
                        <Text style={commonStyles.text}>
                            {localizes('register.alreadyAcc')}
                            <Text style={[commonStyles.textBold,]}> {localizes('register.login_button')}</Text>
                        </Text>
                    </TouchableOpacity>
                    {this.showLoadingBar(this.props.isLoading)}
                    <TouchableOpacity
                        onPress={() => { this.onBack(); }}
                        style={{
                            padding: Constants.PADDING_X_LARGE,
                            position: 'absolute'
                        }}>
                        <Image source={ic_back_blue} />
                    </TouchableOpacity>
                </Root>
            </Container>
        );
    }

    renderButtonRegister() {
        return (
            <ButtonPrimary title={"Đăng ký"} onPress={() => { this.onPressRegister() }} />
        )
    }

    /**
       * Register
       */
    onPressRegister() {
        this.validateAndSignUp();
    }

    /** 
     * on change name
     */
    onChangeName = name => {
        this.setState({
            name,
        });
    };

    /**
     * on change phone
     */
    onChangePhone = phone => {
        this.setState({
            phone,
        });
    };

    /** 
     * on change password
     */
    onChangePassword = password => {
        this.setState({
            password,
        });
    };

    /** 
     * on change password confirm
     */
    onChangePasswordConfirm = confirmPassword => {
        this.setState({
            confirmPassword,
        });
    };

    /** 
     * on change email
     */
    onChangeEmail = email => {
        this.setState({
            email,
        });
    };
}

const mapStateToProps = state => ({
    data: state.signUp.data,
    isLoading: state.signUp.isLoading,
    error: state.signUp.error,
    errorCode: state.signUp.errorCode,
    action: state.signUp.action,
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterView);
