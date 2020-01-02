import React, {Component} from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import BaseView from 'containers/base/baseView';
import bg_confirm from "images/ic_cancel_blue.png";
import ic_check_circle from "images/ic_check_circle.png";
import commonStyles from 'styles/commonStyles';
import {Colors} from 'values/colors';
import {Constants} from 'values/constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Fonts} from 'values/fonts';
import screenType from 'enum/screenType';

export default class ConfirmSuccessView extends BaseView {
    constructor(props) {
        super(props);
        const {route, navigation} = this.props;
        this.state = {
        };
        this.screen = route.params.screen;
    }

    render () {
        return (
            <ImageBackground source={bg_confirm} style={{flex: 1}}>
                <View style={[commonStyles.viewCenter, {paddingVertical: 16}]}>
                    <Image source={ic_check_circle} />
                </View>
                <View style={[commonStyles.viewCenter, {
                    marginHorizontal: Constants.PADDING_X_LARGE,
                    backgroundColor: Colors.COLOR_BLACK_OPACITY_50,
                    borderRadius: Constants.MARGIN,
                    padding: Constants.PADDING_X_LARGE
                }]}>
                    <Text style={[commonStyles.textBold, {margin: 0, color: Colors.COLOR_WHITE, fontSize: Fonts.FONT_SIZE_X_LARGE}]}>
                        {this.renderTitle()}
                    </Text>
                    <View style={{paddingTop: Constants.PADDING_X_LARGE}}>
                        <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_WHITE, textAlign: 'center'}]}>
                            {this.renderMessage()}
                        </Text>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>

                    {this.renderCommonButton(
                        'Hoàn tất',
                        {color: Colors.COLOR_WHITE},
                        {backgroundColor: Colors.COLOR_RED},
                        () => this.handleConfirm()
                    )}
                </View>
            </ImageBackground>
        );
    }

    /**
     * Handle confirm
     */
    handleConfirm = () => {
        if (this.screen == screenType.FROM_CART) {
            this.props.navigation.pop();
            this.props.navigation.navigate("OrderHistory");
        } else {
            this.onBack();
        }
    }

    /**
     * Render title
     */
    renderTitle = () => {
        let title = "";
        switch (this.screen) {
            case screenType.FROM_REGISTER_APPOINTMENT:
                title = 'Đặt lịch hẹn thành công!'
                break;
            case screenType.FROM_EDIT_APPOINTMENT:
                title = 'Chỉnh sửa lịch hẹn thành công!'
                break;
            case screenType.FROM_NOTIFICATION:
                title = 'Gửi đánh giá thành công!'
                break;
            case screenType.FROM_CONTACT:
                title = 'Gửi liên hệ thành công!'
                break;
            case screenType.FROM_CART:
                title = 'Đặt hàng thành công!'
                break;
            default:
                title = "";
                break;
        }
        return title;
    }

    /**
     * Render message
     */
    renderMessage = () => {
        let message = "";
        switch (this.screen) {
            case screenType.FROM_REGISTER_APPOINTMENT:
            case screenType.FROM_EDIT_APPOINTMENT:
                message = 'Chúng tôi sẽ liên hệ cho bạn để xác nhận lịch hẹn.'
                break;
            case screenType.FROM_NOTIFICATION:
                message = 'Cám ơn bạn đã tin tưởng chúng tôi.'
                break;
            case screenType.FROM_CONTACT:
                message = 'Cám ơn bạn đã tin tưởng chúng tôi. Bộ phận tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.'
                break;
            case screenType.FROM_CART:
                message = 'Cám ơn bạn đã tin tưởng chúng tôi. Chúng tôi sẽ gọi điện thoại lại để xác nhận đơn hàng.'
                break;
            default:
                message = "";
                break;
        }
        return message;
    }
}
