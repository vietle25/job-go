import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {
    ImageBackground, Dimensions, View, StatusBar,
    TextInput, ScrollView, TouchableOpacity, Image, Keyboard
} from "react-native";
import {
    Form, Textarea, Container, Header, Title, Left,
    Icon, Right, Button, Body, Content, Text, Card,
    CardItem, Fab, Footer, Input, Item
} from "native-base";
import {Constants} from "values/constants";
import {Colors} from "values/colors";
import BaseView from "containers/base/baseView";
import TimerCountDown from "components/timerCountDown";
import commonStyles from "styles/commonStyles";
import ic_back_black from "images/ic_back_white.png";
import ic_notification_white from "images/ic_notification_white.png";
import {Fonts} from "values/fonts";
import ic_default_user from "images/ic_default_user.png";
import shadow_avatar_home from "images/shadow_avatar_home.png";
import Utils from "utils/utils";
import ImageLoader from "components/imageLoader";
import BackgroundShadow from "components/backgroundShadow";
import StringUtil from "utils/stringUtil";
import {localizes} from "locales/i18n";
import ic_card_id_white from 'images/ic_cancel_blue.png';
import ic_calendar_white from 'images/ic_calendar_white.png';
import ic_marker_map_white from 'images/ic_marker_map_white.png';
import ic_chat_white from 'images/ic_chat_white.png';
import FlatListCustom from "components/flatListCustom";
import ItemBox from './itemBox';
import slidingMenuType from 'enum/slidingMenuType';

const ITEM_PER_ROW = 4;
const listSlidingMenu = [
    {
        title: localizes("utilBox.cardMember"),
        icon: ic_card_id_white,
        forUser: false,
        screen: slidingMenuType.MEMBERSHIP_CARD
    },
    {
        title: localizes("utilBox.appointMents"),
        icon: ic_calendar_white,
        forUser: false,
        screen: slidingMenuType.APPOINTMENT
    },
    {
        title: localizes("utilBox.branch"),
        icon: ic_marker_map_white,
        forUser: false,
        screen: slidingMenuType.BRANCH
    },
    {
        title: localizes("utilBox.chat"),
        icon: ic_chat_white,
        forUser: false,
        screen: slidingMenuType.CHAT
    },
];

export default class UtilitiesBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.userInfo = this.props.userInfo;
    }

    /**
     * RenderItem flat list
     */
    renderItemSlide = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemBox
                data={listSlidingMenu}
                item={item}
                index={index}
                navigation={this.props.navigation}
                userInfo={this.userInfo}
                callBack={this.props.callBack}
            />
        );
    }

    /**
     * render menu
     */
    renderSlidingMenu () {
        return (
            <View style={{
                width: "100%",
            }}>
                <FlatListCustom
                    style={{
                        padding: Constants.PADDING_X_LARGE
                    }}
                    horizontal={false}
                    data={listSlidingMenu}
                    itemPerRow={ITEM_PER_ROW}
                    renderItem={this.renderItemSlide}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    render () {
        const {title, icon, onPress} = this.props;
        return (
            <View style={{backgroundColor: Colors.COLOR_WHITE, }}>
                {this.renderSlidingMenu()}
            </View>
        )
    }
}

