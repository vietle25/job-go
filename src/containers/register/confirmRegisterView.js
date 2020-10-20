'use strict';
import React, {Component} from 'react';
import {
    Dimensions,
    View,
    TextInput,
    Image,
    StyleSheet,
    Text,
    PixelRatio,
    ImageBackground,
    Platform,
    TouchableHighlight,
    TouchableOpacity,
    Keyboard,
    ToastAndroid,
    ScrollView,
    Modal,
    BackHandler,
    StatusBar
} from 'react-native';
import {
    Container,
    Form,
    Content,
    Input,
    Button,
    Right,
    Radio,
    center,
    ListItem,
    Left,
    Header,
    Item,
    Picker,
    Body,
    Root,
} from 'native-base';
import ButtonComp from 'components/button';
import {capitalizeFirstLetter} from 'utils/stringUtil';
import styles from './styles';
import {localizes} from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import I18n from 'react-native-i18n';
import {Colors} from 'values/colors';
import {Fonts} from 'values/fonts';
import {CheckBox} from 'react-native-elements';
import {Constants} from 'values/constants';
import {Icon} from 'react-native-elements';
import Utils from 'utils/utils';
import ModalDropdown from 'components/modalDropdown';
import {connect} from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import {ErrorCode} from 'config/errorCode';
import {getActionSuccess, ActionEvent} from 'actions/actionEvent';
import * as actions from 'actions/userActions';
import GenderType from 'enum/genderType';
import StringUtil from 'utils/stringUtil';
import ImagePicker from 'react-native-image-crop-picker';
import roleType from 'enum/roleType';
import userType from 'enum/userType';
import screenType from 'enum/screenType';
import TextInputCustom from 'components/textInputCustom';
import OTPType from 'enum/otpType';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import ic_hide from 'images/ic_cancel_blue.png';
import LinearGradient from 'react-native-linear-gradient';
import otpType from 'enum/otpType';
import statusType from 'enum/statusType';
import ic_logo from 'images/ic_log_splash.png';
import ic_eye_blue from 'images/ic_eye_blue.png';
import {thisExpression} from '@babel/types';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const deviceHeight = Dimensions.get('window').height;
const MARGIN_BETWEEN_ITEM = 0;
const FACEBOOK = "facebook";
const GOOGLE = "google";
const scrollToX = 0;
const scrollToY = 100;
const scrollToYFullName = 50;
const scrollToYPassword = 200;
class ConfirmRegisterView extends BaseView {
    constructor(props) {
        super(props);
        let {fromScreen, sendType, dataUser} = this.props.route.params;
        let enableEditEmail = true;
        if (this.props.route.params.socialType == FACEBOOK)
            this.isFacebook = true;
        else
            this.isFacebook = false
        this.state = {
            phone: dataUser.phone,
            email: dataUser.email,
            password: '',
            repeatPassword: '',
            fullName: dataUser.name,
            hidePassword: true,
            hidePasswordConfirm: true,
            enableScrollViewScroll: true,
            enableEditEmail: this.isFacebook,
            hidePassword: true,
            hideConfirmPassword: true
        };
        this.hidePassword = true;
        this.hidePasswordConfirm = true;
        this.fromScreen = fromScreen;
    }

    componentDidMount () {
        setTimeout(() => {
            this.setState({
                password: '',
                repeatPassword: '',
            }, () => {});
        }, 50);
    }

    /**
       * Validate and sign up
       */
    validateAndSignUp () {
        const {password, phone, repeatPassword, email, fullName} = this.state;
        let type = [];
        let certificatePath = [];
        if (this.state.images != null) {
            for (let i = 0; i < this.state.images.length; i++) {
                certificatePath.push(this.state.images[i].uri);
            }
        }
        type.push(this.selectedType);
        const res = phone.trim().charAt(0);
        // ====== NAME ======
        if (Utils.isNull(fullName) || fullName.trim().length == 0) {
            this.showMessage(localizes('register.vali_fill_fullname'));
            this.setState({
                fullName: ''
            })
            this.fullName.focus();
        } else if (StringUtil.validSpecialCharacter(fullName) ||
            StringUtil.validEmojiIcon(fullName)) {
            this.showMessage(localizes('register.vali_fullname'));
            this.fullName.focus();
        } else if (StringUtil.validSpecialCharacter2(fullName.trim())) {
            this.showMessage(localizes('register.vali_fullname'));
            this.fullName.focus();
        }
        else if (fullName.length > 60) {
            this.showMessage(localizes('register.vali_fullname_length'));
            this.fullName.focus();
        }
        // ====== PHONE ======
        else if (Utils.isNull(phone)) {
            this.showMessage(localizes('register.vali_fill_phone'));
            this.phone.focus();
        } else if (phone.trim().includes(" ") && phone.trim() == '') {
            this.showMessage(localizes('register.vali_fill_phone'));
            this.phone.focus();
        } else if (Utils.validatePhoneContainWord(phone.trim())) {
            this.showMessage(localizes('register.errorPhone'));
            this.phone.focus();
        }
        else if (Utils.validatePhoneContainSpecialCharacter(phone.trim())) {
            this.showMessage(localizes('register.errorPhone'));
            this.phone.focus();
        }
        else if (phone.trim().includes(" ")) {
            this.showMessage(localizes('register.errorPhone'));
            this.phone.focus();
        } else if (phone.trim().length != 10 || res != '0') {
            this.showMessage(localizes('register.errorPhone'));
            this.phone.focus();
        } else if (!Utils.validatePhone(phone.trim())) {
            this.showMessage(localizes('register.vali_phone'));
            this.phone.focus();
        } else if (Utils.isNull(email) || email.trim().length == 0) {
            // Email
            this.showMessage(localizes('register.vali_fill_email'));
            this.email.focus();
        }
        else if (StringUtil.validSpecialCharacterForEmail(email.trim())) {
            this.showMessage(localizes('register.vali_email'));
            this.email.focus();
        }
        else if (email.trim().length > 150) {
            // Email
            this.showMessage(localizes('register.vali_email_length'));
            this.email.focus();
        } else if (!Utils.validateEmail(email.trim())) {
            this.showMessage(localizes('register.vali_email'));
            this.email.focus();
        } else if (Utils.isNull(password)) {
            this.showMessage(localizes('register.vali_fill_password'));
            this.password.focus();
        } else if (password.length < 6 || password.length > 20) {
            this.showMessage(localizes('register.vali_character_password'));
            this.password.focus();
        }
        else if (password.trim().includes(' ')) {
            this.showMessage(localizes('register.vali_empty_space_password'));
            this.password.focus();
        } else if (password.includes(' ') && password.length > 0) {
            this.showMessage(localizes('register.vali_empty_space_password'));
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
            let userData = this.props.route.params.dataUser;
            // xử lý name
            // bỏ khoảng trắng 2 bên 
            let newName = Utils.cloneObject(this.state.fullName);
            newName = newName.trim();
            for (let i = 0; i < newName.length; i++) {
                newName = newName.replace('  ', ' ');
            }
            userData.phone = this.state.phone.trim();
            userData.password = this.state.password.trim();
            userData.email = this.state.email.trim();
            userData.email = userData.email.toLowerCase().trim();
            userData.name = StringUtil.validMultipleSpace(userData.name.trim())
            userData.isConfirm = 0;
            // login FACEBOOK 
            if (this.isFacebook)
                this.props.loginFacebookInConfirm(userData);
            // login GOOGLE 
            else
                this.props.loginGoogleInConfirm(userData);
        }
        this._container.scrollTo({x: 0, y: 0, animated: true});
    }

    /**
     * focus input
     * @param {} text 
     */
    focusInput (text) {
        if (this.isFirstTime) return true;
        return text !== '';
    }

    /**
     * manage password visibity
     */
    managePasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.password;
        this.setState({hidePassword: !this.state.hidePassword, password: ''});
        setTimeout(() => {
            this.setState({password: last});
        }, 0);
    };

    /**
       * Manage Confirm Password Visibility
       */
    manageConfirmPasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.confirmPassword;
        this.setState({
            hideConfirmPassword: !this.state.hideConfirmPassword,
            confirmPassword: '',
        });
        setTimeout(() => {
            this.setState({confirmPassword: last});
        }, 0);
    };

    /**
       * Handle data when request
       */
    handleData () {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (
                    this.props.action == getActionSuccess(ActionEvent.LOGIN_FB_IN_CONFIRM) ||
                    this.props.action == getActionSuccess(ActionEvent.LOGIN_GOOGLE_IN_CONFIRM)
                ) {
                    let data = this.props.data;
                    if (data.status == statusType.ACTIVE) {
                        StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
                        //Save token login
                        StorageUtil.storeItem(StorageUtil.USER_TOKEN, data.token);
                        StorageUtil.storeItem(
                            StorageUtil.FIREBASE_TOKEN,
                            data.firebaseToken
                        );
                        global.token = data.token;
                        global.firebaseToken = data.firebaseToken;
                        this.props.getUserProfile(data.id);
                        this.props.notifyLoginSuccess();
                        this.props.getNotificationsRequest({
                            userId: data.id,
                            paging: {
                                pageSize: Constants.PAGE_SIZE,
                                page: 0,
                            },
                        });
                        this.goHomeScreen();
                        this.refreshToken();
                        if (this.props.route.params) {
                            const {router} = this.props.route.params;
                            if (!Utils.isNull(router)) {
                                this.props.navigation.navigate(router.name, router.params);
                            }
                        }
                    }
                }
            } else if (this.props.errorCode == ErrorCode.USER_EXIST_TRY_LOGIN_FAIL) {
                this.showMessage(localizes('register.existMobile'));
            } else if (this.props.errorCode == ErrorCode.USER_EMAIL_ALREADY_TAKEN) {
                this.showMessage(localizes('confirm_register.existEmail'));
                this.email.focus();
            } else if (this.props.errorCode == ErrorCode.USER_PHONE_ALREADY_REGISTERD) {
                this.showMessage(localizes('register.existMobile'));
                this.phone.focus();
            }
            else if (this.props.errorCode == ErrorCode.USER_HAS_BEEN_DELETED) {
                this.showMessage(localizes('login.userHasBeenDeleted'));
            }
            else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    render () {
        return (
            <Container style={[styles.container]}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        backgroundColor={Colors.COLOR_WHITE}
                        elevation={0}
                        visibleBack={false}
                        titleStyle={[commonStyles.textBold, {color: Colors.COLOR_GREEN_LIGHT, fontSize: Fonts.FONT_SIZE_LARGE}]}
                        showCart={this.showCart}
                        visibleBack={true}
                        title={localizes('confirm_register.confirm_register_title')}
                    />
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContentContainer}
                        style={styles.scrollView}
                        keyboardShouldPersistTaps="handled"
                        ref={r => (this._container = r)}
                        scrollEnabled={this.state.enableScrollViewScroll}
                        showsVerticalScrollIndicator={false}
                    >

                        <View style={styles.viewFormRegister}>
                            <View
                                style={{
                                    alignItems: 'center',
                                    marginBottom: Constants.MARGIN_X_LARGE,
                                }}
                            >
                                <Image source={ic_logo} resizeMode={'contain'} />
                            </View>
                            {/* {Input form} */}
                            <Form style={styles.formRegister}>
                                {/* Full name */}
                                <TextInputCustom
                                    backgroundColor={Colors.COLOR_TRANSPARENT}
                                    placeholderTextColor="black"
                                    styleInputGroup={styles.inputGroup}
                                    refInput={input => (this.fullName = input)}
                                    isInputNormal={true}
                                    placeholder={localizes('register.contactName')}
                                    value={this.state.fullName}
                                    onChangeText={fullName => this.setState({fullName})}
                                    inputNormalStyle={styles.inputNormal}
                                    onSubmitEditing={() => {
                                        this.phone.focus();
                                        this._container.scrollTo({x: scrollToX, y: scrollToYFullName, animated: true});
                                    }}
                                    returnKeyType={'next'}
                                    autoCapitalize={'words'}
                                    {...(this.focusInput(this.state.fullName)
                                        ? {autoFocus: true}
                                        : null)}
                                />
                                {/* Phone*/}
                                <TextInputCustom
                                    backgroundColor={Colors.COLOR_TRANSPARENT}
                                    placeholderTextColor="black"
                                    styleInputGroup={styles.inputGroup}
                                    placeholder={localizes('register.phone')}
                                    refInput={r => (this.phone = r)}
                                    isInputNormal={true}
                                    value={this.state.phone}
                                    onChangeText={phone => this.setState({phone})}
                                    onSubmitEditing={() => {
                                        this.email.focus();
                                        this._container.scrollTo({x: scrollToX, y: scrollToY, animated: true});
                                    }}
                                    returnKeyType={'next'}
                                    inputNormalStyle={styles.inputNormal}
                                    keyboardType="phone-pad"
                                />
                                {/* Email*/}
                                {this.state.enableEditEmail == true && <TextInputCustom
                                    backgroundColor={Colors.COLOR_TRANSPARENT}
                                    placeholderTextColor="black"
                                    styleInputGroup={[styles.inputGroup]}
                                    placeholder={localizes('register.email')}
                                    refInput={r => (this.email = r)}
                                    isInputNormal={true}
                                    value={this.state.email}
                                    onChangeText={email => this.setState({email})}
                                    onSubmitEditing={() => {
                                        this.password.focus();
                                        this._container.scrollTo({x: scrollToX, y: scrollToY, animated: true});
                                    }}
                                    returnKeyType={'next'}
                                    inputNormalStyle={styles.inputNormal}
                                    keyboardType="email-address"
                                    editable={true}
                                />}
                                {this.state.enableEditEmail == false && <TextInputCustom
                                    backgroundColor={Colors.COLOR_TRANSPARENT}
                                    placeholderTextColor="black"
                                    styleInputGroup={[styles.inputGroup, {backgroundColor: Colors.COLOR_GRAY}]}
                                    placeholder={localizes('register.email')}
                                    refInput={r => (this.email = r)}
                                    isInputNormal={true}
                                    value={this.state.email}
                                    onChangeText={email => this.setState({email})}
                                    onSubmitEditing={() => {
                                        this.password.focus();
                                        this._container.scrollTo({x: scrollToX, y: scrollToY, animated: true});
                                    }}
                                    returnKeyType={'next'}
                                    inputNormalStyle={styles.inputNormal}
                                    keyboardType="words"
                                    editable={false}
                                />}

                                {/*Password*/}
                                <View style={styles.password}>
                                    <TextInputCustom
                                        backgroundColor={Colors.COLOR_TRANSPARENT}
                                        placeholderTextColor="black"
                                        refInput={input => {
                                            this.password = input;
                                        }}
                                        styleInputGroup={styles.inputGroup}
                                        isInputNormal={true}
                                        placeholder={localizes('register.input_password')}
                                        value={this.state.password}
                                        onChangeText={password => this.setState({password})}
                                        onSubmitEditing={() => {
                                            this.confirmPassword.focus();
                                            this._container.scrollTo({x: scrollToX, y: scrollToYPassword, animated: true});
                                        }}
                                        returnKeyType={'next'}
                                        blurOnSubmit={false}
                                        numberOfLines={1}
                                        secureTextEntry={this.state.hidePassword}
                                        inputNormalStyle={styles.inputNormal}
                                    />
                                    <TouchableHighlight
                                        onPress={this.managePasswordVisibility}
                                        style={[commonStyles.shadowOffset, {
                                            position: 'absolute',
                                            right: Constants.PADDING_X_LARGE + Constants.PADDING,
                                            // paddingTop: 60
                                        }]}
                                        underlayColor='transparent'
                                    >
                                        <Image style={{resizeMode: 'contain', width: 18, height: 18}}
                                            source={(this.state.hidePassword) ? ic_hide : ic_eye_blue} />
                                    </TouchableHighlight>
                                </View>
                                {/* Confirm password */}
                                <View style={styles.viewConfirmPassword}>
                                    <TextInputCustom
                                        backgroundColor={Colors.COLOR_TRANSPARENT}
                                        placeholderTextColor="black"
                                        refInput={input => {
                                            this.confirmPassword = input;
                                        }}
                                        styleInputGroup={styles.inputGroup}
                                        isInputNormal={true}
                                        placeholder={localizes('register.confirmPass')}
                                        value={this.state.repeatPassword}
                                        onChangeText={repeatPassword =>
                                            this.setState({repeatPassword})}
                                        onSubmitEditing={() => {
                                            // this.ChassisNumber.focus();
                                        }}
                                        secureTextEntry={this.state.hideConfirmPassword}
                                        returnKeyType={'next'}
                                        blurOnSubmit={false}
                                        numberOfLines={1}
                                        inputNormalStyle={styles.inputNormal}
                                    />
                                    <TouchableHighlight
                                        onPress={this.manageConfirmPasswordVisibility}
                                        style={[commonStyles.shadowOffset, {
                                            position: 'absolute',
                                            right: Constants.PADDING_X_LARGE + Constants.PADDING,
                                            // paddingTop: 60
                                        }]}
                                        underlayColor='transparent'
                                    >
                                        <Image style={{resizeMode: 'contain', width: 18, height: 18}}
                                            source={(this.state.hideConfirmPassword) ? ic_hide : ic_eye_blue} />
                                    </TouchableHighlight>
                                </View>
                                {Platform.OS === "android" ? <View /> : <KeyboardSpacer />}
                                {this.renderCommonButton(
                                    localizes('confirm_register.confirm_register_button'),
                                    {color: styles.buttonRegister.textColor},
                                    {},
                                    () => this.onPressRegister()
                                )}
                            </Form>

                        </View>
                    </ScrollView>
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }

    /**
       * Register
       */
    onPressRegister () {
        this.validateAndSignUp();
    }

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
    data: state.confirmSocialAccount.data,
    isLoading: state.confirmSocialAccount.isLoading,
    error: state.confirmSocialAccount.error,
    errorCode: state.confirmSocialAccount.errorCode,
    action: state.confirmSocialAccount.action,
});

export default connect(mapStateToProps, actions)(ConfirmRegisterView);
