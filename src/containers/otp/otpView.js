'use strict';
import React, { Component } from 'react';
import {
    View, TextInput, Image, StyleSheet, Text, ImageBackground, Keyboard,
    ToastAndroid, TouchableOpacity, ScrollView, BackHandler, StatusBar
} from 'react-native';
import { Container, Form, Content, Item, Input, Button, Right, Radio, center, ListItem, Left, Root, Header, Body } from 'native-base';
import ButtonComp from 'components/button';
import { capitalizeFirstLetter } from 'utils/stringUtil';
import styles from './styles';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import { Colors } from 'values/colors';
import I18n from 'react-native-i18n';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import { Icon, colors } from 'react-native-elements';
import Utils from 'utils/utils'
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import { connect } from 'react-redux';
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import StorageUtil from 'utils/storageUtil';
import screenType from 'enum/screenType';
import DateUtil from 'utils/dateUtil';
import statusType from 'enum/statusType';
import ic_logo_h2 from "images/ic_log_splash.png";
import ic_logo_green from 'images/ic_log_splash.png';
import HeaderGradient from 'containers/common/headerGradient.js';
import ButtonGradient from 'containers/common/buttonGradient';
import LinearGradient from "react-native-linear-gradient";
import otpType from 'enum/otpType';
import otp_bg from 'images/otp_bg.jpg';
import ButtonPrimary from 'components/buttonPrimary';
import ic_back_blue from 'images/ic_back_blue.png';

class OTPView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            codeOTP: '',
            statusSend: false,
            textButton: localizes('otp.btnConfirm'),
            user: null,
            timeCountDown: 3 * 60,
        }
        this.auThenTime = 3 * 60;
        const { type, phone } = this.props.route.params;
        this.type = type;
        this.phone = phone;
    };

    /**
     * Send otp
     */
    sendOTP () {
        let filter = {
            type: this.type,
            phone: this.phone
        };
        this.props.sendOTP(filter);
        this.setState({
            statusSend: true,
            timeCountDown: this.auThenTime
        });
    }

    // Action button
    onActionOTP = () => {
        const { statusSend, codeOTP } = this.state;
        const filter = {
            code: codeOTP,
            phone: this.phone,
            type: otpType.FORGOT_PASS
        }
        // alert(filter.)
        this.props.confirmOTP(filter)
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData();
        }
    }

    handleData () {
        const { statusSend, textButton } = this.state;
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.SEND_OTP)) {
                    console.log("SEND_OTP: ", data)
                    if (!Utils.isNull(data)) {
                        StorageUtil.storeItem(StorageUtil.OTP_KEY, data)
                        this.setState({
                            statusSend: true,
                            textButton: localizes('otp.btnConfirm'),
                            timeCountDown: this.auThenTime,
                        })
                    } else {
                        console.log('Ma OTP chua duoc gui')
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.CONFIRM_OTP)) {
                    if (!Utils.isNull(data)) {
                        console.log("data confirem otp", data)
                        if (data.error == ErrorCode.ERROR_SUCCESS) {
                            this.props.navigation.pop(1);
                            this.props.navigation.navigate("ConfirmPassword", {
                                phone: this.phone
                            })
                        } else if (data.error == ErrorCode.OTP_INCORRECT) {
                            alert('OTP Không chính xác')
                        }
                    } else {
                        this.showMessage(localizes('otp.errOTP'));
                    }
                } else {
                    this.handleError(this.props.errorCode, this.props.error)
                }
            }
        }
    }

    componentDidMount () {
        StatusBar.setBackgroundColor('#271b29', true);
        BackHandler.addEventListener("hardwareBackPress", () => { this.handlerBackButton });
        this._interval = setInterval(() => {
            if (this.state.timeCountDown > 0) {
                this.setState({
                    timeCountDown: this.state.timeCountDown - 1,
                    textButton: localizes('otp.btnConfirm'),
                })
            } else {
                this.setState({
                    statusSend: false,
                    textButton: localizes('otp.resendOTP'),
                })
            }
        }, 1000);
    }

    componentWillUnmount () {
        BackHandler.removeEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    render () {
        const { textButton, statusSend, timeCountDown, codeOTP } = this.state;
        StatusBar.setBackgroundColor('#271b29', true);
        return (
            <Container style={styles.container}>
                <ImageBackground source={otp_bg} style={{ flex: 1 }} blurRadius={0}>
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1, justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={[commonStyles.titleInputForm, {
                            alignItems: 'flex-start',
                            marginLeft: 0, textAlign: 'center',
                            color: Colors.COLOR_WHITE,
                            marginBottom: Constants.MARGIN_XX_LARGE
                        }]}>Xác nhận OTP</Text>
                        <Text style={[commonStyles.text, {
                            fontSize: Fonts.FONT_SIZE_X_MEDIUM,
                            margin: 0, color: Colors.COLOR_WHITE, textAlign: 'center',
                            marginHorizontal: Constants.MARGIN_XX_LARGE
                        }]}>
                            {localizes('otp.noteOTP')}
                            <Text style={[commonStyles.textBold, {
                                margin: 0,
                                color: Colors.COLOR_WHITE
                            }]}>{this.phone}</Text>
                        </Text>
                        <TextInput
                            style={styles.inputOTP}
                            onChangeText={codeOTP => { this.setState({ codeOTP }, () => codeOTP ? null : null) }}
                            keyboardType="numeric"
                            value={codeOTP}
                            underlineColorAndroid='transparent'
                            maxLength={4}
                            onKeyPress={(event) =>
                                event.nativeEvent.key == "Backspace"
                                    ? codeOTP ? null : this.setState({ charThere: "" }, () => this.charThere.focus())
                                    : null
                            }
                            ref={ref => this.codeOTP = ref}
                        />
                        <Text style={styles.textCountDown}>
                            {timeCountDown != 0
                                ? DateUtil.parseMillisecondToTime(this.state.timeCountDown * 1000) + " phút"
                                : localizes('otp.resendOTP')
                            }
                            <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE }]}>
                                {"\n"} {"Bạn chưa nhận được OTP?  "}
                                <Text style={[commonStyles.textBold, { color: Colors.COLOR_WHITE }]} onPress={() => this.sendOTP()}>
                                    Gửi lại
                                </Text>
                            </Text>
                        </Text>
                        <ButtonPrimary
                            style={{ marginTop: Constants.MARGIN_XX_LARGE }}
                            onPress={() => { this.onActionOTP() }}
                            title={"Xác nhận"} />
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
    data: state.otp.data,
    action: state.otp.action,
    isLoading: state.otp.isLoading,
    error: state.otp.error,
    errorCode: state.otp.errorCode
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, actions)(OTPView);