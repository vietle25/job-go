import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {ImageBackground, Dimensions, View, StatusBar, TextInput, ScrollView, TouchableOpacity, Image, Keyboard, StyleSheet} from "react-native";
import {Form, Textarea, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Fab, Footer, Input, Item} from "native-base";
import {Constants} from "values/constants";
import {Colors} from "values/colors";
import BaseView from "containers/base/baseView";
import TimerCountDown from "components/timerCountDown";
import commonStyles from "styles/commonStyles";
import ic_back_black from "images/ic_back_white.png";
import i from "images/ic_back_white.png";
import {Fonts} from "values/fonts";
import ic_default_user from "images/ic_default_user.png";
import shadow_avatar_home from "images/shadow_avatar_home.png";
import Utils from "utils/utils";
import ImageLoader from "components/imageLoader";
import BackgroundShadow from "components/backgroundShadow";
import StringUtil from "utils/stringUtil";
import {localizes} from "locales/i18n";
import ic_close_white from 'images/ic_close_white.png';

export default class ItemCommendFriend extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            requesting: false,
            window: this.props.window
        };
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.state.requesting = this.props.item.requesting;
            this.state.window = this.props.window;
        }
    }

    render () {
        const {item, index, data, onPress, urlPathResize, onDeleteFriend} = this.props;
        const {window} = this.state;
        let image = "";
        let hasHttp = false;
        if (!Utils.isNull(item.avatar)) {
            hasHttp = !Utils.isNull(item.avatar) && item.avatar.indexOf('http') != -1;
            image = hasHttp ? item.avatar : urlPathResize + "=" + item.avatar;
        }
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => onPress(item, index)}
                block
                style={[styles.container, {
                    width: window.width / 3.4,
                    height: window.width / 3
                }]}>
                <ImageLoader
                    style={{
                        width: window.width / 7,
                        height: window.width / 7,
                        borderRadius: window.width / 7 / 2
                    }}
                    resizeModeType={'cover'}
                    resizeAtt={hasHttp ? null : {type: 'resize', width: window.width / 7}}
                    path={image}
                />
                <Text
                    numberOfLines={1}
                    style={[commonStyles.textSmall, {
                        marginHorizontal: Constants.MARGIN_X_LARGE,
                        textAlign: 'center',
                    }]}>{item.friendName ? item.friendName : ''}</Text>
                {this.renderBtnMakeFriend()}
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={() => onDeleteFriend(item.friendId)}
                    style={styles.btnDelete}>
                    <Image
                        source={ic_close_white}
                        style={{width: 10, height: 10}}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    /**
     * Render btn make friend
     */
    renderBtnMakeFriend = () => {
        const {item, onSendFriendRequest, onCancelFriend} = this.props;
        const {requesting} = this.state;
        return (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                        if (requesting) {
                            item.requesting = true;
                            this.setState({requesting: false});
                            onCancelFriend(item.friendId);
                        } else {
                            item.requesting = false;
                            this.setState({requesting: true});
                            onSendFriendRequest(item.friendId);
                        }
                    }}
                    style={{
                        paddingHorizontal: Constants.PADDING_LARGE,
                        backgroundColor: requesting ? Colors.COLOR_DRK_GREY : Colors.COLOR_PRIMARY,
                        borderRadius: Constants.CORNER_RADIUS,
                        paddingVertical: Constants.PADDING_LARGE
                    }}>
                    <Text style={[commonStyles.text, {color: Colors.COLOR_WHITE, margin: 0, padding: 0}]}>{requesting ? "Hủy yêu cầu" : "Thêm bạn"}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...commonStyles.viewCenter,
        borderRadius: Constants.CORNER_RADIUS,
        marginVertical: Constants.MARGIN_LARGE
    },
    btnDelete: {
        ...commonStyles.viewCenter,
        width: 16,
        height: 16,
        position: "absolute",
        top: 0, right: 16,
        backgroundColor: Colors.COLOR_BLACK_OPACITY_50,
        borderRadius: 8
    }
})

