'use strict';
import React, { Component } from 'react';
import { View, TextInput, Image, StyleSheet, Text, ImageBackground, Alert, TouchableHighlight, TouchableOpacity, ToastAndroid, Platform, Keyboard, BackHandler } from 'react-native';
import { Container, Form, Content, Item, Input, Button, Right, ListItem, Radio, Left, Icon, Header, Root, Toast } from 'native-base';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import I18n from 'react-native-i18n';
import { Colors } from 'values/colors'
import * as actions from 'actions/userActions';
import { connect } from 'react-redux';
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import StorageUtil from 'utils/storageUtil';
import { Constants } from 'values/constants';
import Utils from "utils/utils";
import { Fonts } from 'values/fonts';
import TextInputCustom from 'components/textInputCustom';
import DialogCustom from 'components/dialogCustom';
import house_key_grey from 'images/ic_cancel_blue.png';
import ic_logo_green from 'images/ic_log_splash.png';
import ic_eye_close from 'images/ic_eye_close.png';
import ic_eye_blue from 'images/ic_eye_blue.png';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import LinearGradient from "react-native-linear-gradient";
import screenType from 'enum/screenType';
import ic_back_blue from 'images/ic_back_blue.png'


class ChangePassword extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            oldPass: null,
            newPass: null,
            confirmPass: null,
            hideOldPassword: true,
            hideNewPassword: true,
            hideNewPasswordConfirm: true,
            isData: false,
            isAlertSuccess: false
        }
        this.isShowOldPass = false;
        this.screenType = this.props.route.params.screenType;
    }

    componentDidMount () {
        BackHandler.addEventListener("hardwareBackPress", () => { this.handlerBackButton });
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                this.props.checkExistPassword();
            }
        }).catch(error => {
            //this callback is executed when your Promise is rejected
            this.saveException(error, 'componentDidMount')
        });
    }

    componentWillUnmount () {
        BackHandler.removeEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    // Hide & show old password
    manageOldPasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.oldPass
        this.setState({
            hideOldPassword: !this.state.hideOldPassword,
            oldPass: ""
        });
        setTimeout(() => {
            this.setState({
                oldPass: last
            })
        }, 0)
    }

    // Hide & show new password
    manageNewPasswordVisibility = () => {
        // function used to change password visibility
        let last = this.state.newPass
        this.setState({
            hideNewPassword: !this.state.hideNewPassword,
            newPass: ""
        });
        setTimeout(() => {
            this.setState({
                newPass: last
            })
        }, 0)
    }

    // Hide & show confirm new password
    manageNewPasswordConfirmVisibility = () => {
        let last = this.state.confirmPass
        this.setState({
            hideNewPasswordConfirm: !this.state.hideNewPasswordConfirm,
            confirmPass: ""
        });
        setTimeout(() => {
            this.setState({
                confirmPass: last
            })
        }, 0)
    }

    // On press change password
    onPressCommonButton = () => {
        let {
            oldPass,
            newPass,
            confirmPass
        } = this.state;
        if (oldPass.length == 0 && this.isShowOldPass) {
            this.showMessage(localizes('setting.enterOldPass'))
            this.password.focus()
            return false
        } else if (newPass == "") {
            this.showMessage(localizes('setting.enterNewPass'))
            this.newPassword.focus()
            return false
        } else if (newPass.length < 6 || newPass.length > 20) {
            this.showMessage(localizes("confirmPassword.vali_character_password"))
            this.newPassword.focus()
            return false
        } else if (Utils.validateSpacesPass(newPass)) {
            this.showMessage(localizes("register.vali_empty_space_password"));
            this.newPassword.focus();
            return false
        } else if (!Utils.validateContainUpperPassword(newPass)) {
            this.showMessage(localizes("confirmPassword.vali_character_password"));
            this.newPassword.focus();
            return false
        } else if (confirmPass.length == 0) {
            this.showMessage(localizes('setting.enterConfPass'))
            this.confirmPassword.focus()
            return false
        } else if (newPass !== confirmPass) {
            this.showMessage(localizes('register.vali_confirm_password'))
            this.confirmPassword.focus()
            return false
        } else {
            this.props.changePass(oldPass, newPass);
            return true;
        }
    }

    handleData () {
        let data = this.props.data;
        if (data != null && this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.CHANGE_PASS)) {
                    if (data) {
                        this.setState({
                            oldPass: null,
                            newPass: null,
                            confirmPass: null,
                            hideOldPassword: true,
                            hideNewPassword: true,
                            hideNewPasswordConfirm: true,
                            // isAlertSuccess: true
                        })
                        this.showMessage(localizes("setting.change_pass_success"))
                        setTimeout(() => {
                            this.onBack()
                        }, 500)
                    } else {
                        if (this.isShowOldPass) {
                            this.showMessage(localizes('setting.oldPassFail'));
                            this.password.focus();
                        }
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.CHECK_EXIST_PASSWORD)) {
                    this.isShowOldPass = data;
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

    render () {
        return (
            <Container style={styles.container}>
                <Root>
                    <Content contentContainerStyle={{ flexGrow: 1, paddingHorizontal: Constants.PADDING_X_LARGE }}
                        style={{ flex: 1, backgroundColor: Colors.COLOR_BACKGROUND }}>
                        <View style={commonStyles.circleBg} />
                        <TouchableOpacity
                            onPress={() => { this.handlerBackButton() }}
                            style={{
                                paddingVertical: Constants.PADDING_X_LARGE,
                                paddingRight: Constants.PADDING_LARGE,
                                marginLeft: - 8
                            }}>
                            <Image source={ic_back_blue} />
                        </TouchableOpacity>
                        <Text style={[commonStyles.titleInputForm, { marginLeft: 0 }]}>Đổi mật khẩu</Text>
                        <View style={{ flexGrow: 1, marginTop: 80 }}>
                            {this.screenType == screenType.CHANGE_PASS_VIEW
                                && <View style={{ justifyContent: 'center', position: 'relative' }}>
                                    <TextInputCustom
                                        styleTextInput={{ marginBottom: Constants.MARGIN_X_LARGE }}
                                        refInput={ref => (this.password = ref)}
                                        isInputNormal={true}
                                        placeholder={"Mật khẩu cũ"}
                                        value={this.state.oldPass}
                                        secureTextEntry={this.state.hideOldPassword}
                                        onChangeText={(text) => {
                                            this.setState({
                                                oldPass: text
                                            })
                                        }}
                                        onSubmitEditing={() => {
                                            this.newPassword.focus();
                                        }}
                                        returnKeyType={"next"}
                                        contentRight={this.state.hideOldPassword ? ic_eye_close : ic_eye_blue}
                                        onPressRight={this.manageOldPasswordVisibility}
                                        textBackground={Colors.COLOR_WHITE}
                                        styleIcon={{ resizeMode: 'contain', width: 18, height: 18, padding: Constants.PADDING_LARGE }}
                                    />
                                </View>
                            }
                            {/* New password */}
                            <View style={{ justifyContent: 'center', position: 'relative' }}>
                                <TextInputCustom
                                    refInput={ref => this.newPassword = ref}
                                    isInputNormal={true}
                                    placeholder={"Mật khẩu mới"}
                                    value={this.state.newPass}
                                    secureTextEntry={this.state.hideNewPassword}
                                    onChangeText={
                                        (text) => {
                                            this.setState({
                                                newPass: text
                                            })
                                        }
                                    }
                                    styleTextInput={{ marginBottom: Constants.MARGIN_X_LARGE }}
                                    onSubmitEditing={() => {
                                        this.confirmPassword.focus();
                                    }}
                                    returnKeyType={"next"}
                                    contentRight={this.state.hideOldPassword ? ic_eye_close : ic_eye_blue}
                                    onPressRight={this.manageNewPasswordVisibility}
                                    textBackground={Colors.COLOR_WHITE}
                                    styleIcon={{ resizeMode: 'contain', width: 18, height: 18, padding: Constants.PADDING_LARGE }}
                                />
                            </View>
                            {/* Confirm new password */}
                            <View style={{ justifyContent: 'center', position: 'relative' }}>
                                <TextInputCustom
                                    refInput={ref => this.confirmPassword = ref}
                                    isInputNormal={true}
                                    titleStyles={{ marginLeft: Constants.MARGIN_XX_LARGE }}
                                    placeholder={"Nhập lại mật khẩu mới"}
                                    value={this.state.confirmPass}
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                    styleTextInput={{ marginBottom: Constants.MARGIN_X_LARGE }}
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={this.state.hideNewPasswordConfirm}
                                    onChangeText={
                                        (text) => {
                                            this.setState({
                                                confirmPass: text
                                            })
                                        }
                                    }
                                    returnKeyType={"done"}
                                    textBackground={Colors.COLOR_WHITE}
                                    contentRight={this.state.hideOldPassword ? ic_eye_close : ic_eye_blue}
                                    onPressRight={this.manageNewPasswordConfirmVisibility}
                                    styleIcon={{ resizeMode: 'contain', width: 18, height: 18, padding: Constants.PADDING_LARGE }}
                                />
                            </View>
                        </View>
                        <View style={{ justifyContent: 'flex-end' }}>
                            {this.renderCommonButton(
                                'Cập nhật',
                                { color: Colors.COLOR_WHITE },
                                {
                                    borderRadius: Constants.PADDING,
                                    borderColor: Colors.COLOR_GREY_LIGHT,
                                    padding: Constants.PADDING_LARGE,
                                    borderWidth: 0.5
                                },
                                () => this.onPressCommonButton()
                            )}
                        </View>
                    </Content>
                    {this.renderAlertSuccess()}
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        )
    }

    /**
     * Render alert success
     */
    renderAlertSuccess () {
        return (
            <DialogCustom
                visible={this.state.isAlertSuccess}
                isVisibleTitle={true}
                isVisibleOneButton={true}
                isVisibleContentText={true}
                contentTitle={"Thông báo"}
                textBtn={"Đồng ý"}
                contentText={localizes("setting.change_pass_success")}
                onPressBtn={() => {
                    this.setState({ isAlertSuccess: false })
                    this.props.navigation.goBack()
                }}
            />
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
export default connect(mapStateToProps, actions)(ChangePassword);